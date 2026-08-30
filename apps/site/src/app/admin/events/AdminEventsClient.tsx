"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, MoreVertical, Pencil, Archive, Calendar, MapPin, RefreshCw, ImageIcon, Search, Filter, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const DATE_OPERATORS = [
  { id: "is" as const, label: "Is" },
  { id: "is_before" as const, label: "Is before" },
  { id: "is_after" as const, label: "Is after" },
  { id: "is_on_or_before" as const, label: "Is on or before" },
  { id: "is_on_or_after" as const, label: "Is on or after" },
  { id: "is_in_between" as const, label: "Is in between" },
] as const;

function formatDateLabel(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** Event is past if its date (start of day) is before today (start of day) */
function isEventPast(dateStr: string): boolean {
  const eventDate = new Date(dateStr);
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return eventDay < todayStart;
}

interface AdminEventsClientProps {
  initialEvents: Event[];
}

export function AdminEventsClient({ initialEvents }: AdminEventsClientProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [archiveConfirm, setArchiveConfirm] = useState<{ id: string; title: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "past">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateOperator, setDateOperator] = useState<(typeof DATE_OPERATORS)[number]["id"]>("is_in_between");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [toastExiting, setToastExiting] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState<number | null>(null);

  async function fetchSyncStatus() {
    try {
      const res = await fetch("/api/luma-sync-status");
      if (!res.ok) return;
      const data = await res.json();
      setUnsyncedCount(data.unsyncedCount ?? 0);
    } catch {
      setUnsyncedCount(null);
    }
  }

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  // Sync past events in DB when admin loads page (keeps is_upcoming in sync)
  useEffect(() => {
    fetch("/api/events-sync-past", { method: "POST" })
      .then((r) => r.ok && r.json())
      .then(async (data) => {
        if (data?.updated > 0) {
          const { data: fresh } = await supabase.from("events").select("*").order("date", { ascending: false });
          if (fresh) setEvents(fresh as Event[]);
        }
      })
      .catch(() => {});
  }, []);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!toast) return;
    setToastExiting(false);
    toastTimeoutRef.current = setTimeout(() => {
      setToastExiting(true);
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
        setToastExiting(false);
        toastTimeoutRef.current = null;
      }, 300);
    }, 4000);
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [toast]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    luma_url: "",
    image_url: "",
    is_upcoming: true,
    attendee_count: null as number | null,
  });

  function openCreate() {
    setEditingEvent(null);
    setFormData({ title: "", description: "", date: "", location: "", luma_url: "", image_url: "", is_upcoming: true, attendee_count: null });
    setIsModalOpen(true);
  }

  function openEdit(event: Event) {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 16),
      location: event.location,
      luma_url: event.luma_url,
      image_url: event.image_url || "",
      is_upcoming: event.is_upcoming,
      attendee_count: event.attendee_count ?? null,
    });
    setIsModalOpen(true);
  }

  async function handleSyncFromLuma() {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/sync-luma-events", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      const { data: fresh } = await supabase.from("events").select("*").order("date", { ascending: false });
      if (fresh) setEvents(fresh as Event[]);
      setToast({ message: `Added ${data.added} events from Luma`, type: "success" });
      await fetchSyncStatus();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Sync failed", type: "error" });
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error } = await supabase.storage.from("event-covers").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("event-covers").getPublicUrl(path);
      setFormData((prev) => ({ ...prev, image_url: urlData.publicUrl }));
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Upload failed", type: "error" });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    if (editingEvent) {
      const { error } = await supabase
        .from("events")
        .update(formData)
        .eq("id", editingEvent.id);

      if (!error) {
        setEvents(events.map((e) => (e.id === editingEvent.id ? { ...e, ...formData } : e)));
      }
    } else {
      const { data, error } = await supabase
        .from("events")
        .insert({
          ...formData,
          image_url: formData.image_url || "",
        })
        .select()
        .single();

      if (!error && data) {
        setEvents([...events, data as Event]);
      }
    }
    setIsModalOpen(false);
  }

  function openArchiveConfirm(event: Event) {
    setArchiveConfirm({ id: event.id, title: event.title });
  }

  const filteredEvents = events.filter((event) => {
    const past = isEventPast(event.date);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "upcoming" && !past) ||
      (statusFilter === "past" && past);
    const matchesSearch =
      !searchQuery.trim() ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const eventDate = new Date(event.date);
    const eventDayStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    let matchesDate = true;
    if (dateFrom || dateTo) {
      if (dateOperator === "is_in_between" && dateFrom && dateTo) {
        const fromStart = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
        const toEnd = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59);
        matchesDate = eventDate >= fromStart && eventDate <= toEnd;
      } else if (dateFrom) {
        const fromStart = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
        const fromEnd = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), 23, 59, 59);
        if (dateOperator === "is") matchesDate = eventDayStart.getTime() === fromStart.getTime();
        else if (dateOperator === "is_before") matchesDate = eventDate < fromStart;
        else if (dateOperator === "is_after") matchesDate = eventDate > fromEnd;
        else if (dateOperator === "is_on_or_before") matchesDate = eventDate <= fromEnd;
        else if (dateOperator === "is_on_or_after") matchesDate = eventDate >= fromStart;
      }
    }
    return matchesStatus && matchesSearch && matchesDate;
  });

  async function handleArchiveConfirm() {
    if (!archiveConfirm) return;
    const { error } = await supabase.from("events").update({ is_archived: true }).eq("id", archiveConfirm.id);
    if (!error) {
      setEvents(events.filter((e) => e.id !== archiveConfirm.id));
    }
    setArchiveConfirm(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage events and meetups. Sync from Luma (ICS), then upload cover images.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              onClick={handleSyncFromLuma}
              disabled={isSyncing || unsyncedCount === 0}
              className="cursor-pointer"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} /> {isSyncing ? "Syncing…" : "Sync from Luma"}
            </Button>
            {unsyncedCount != null && unsyncedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
                {unsyncedCount > 99 ? "99+" : unsyncedCount}
              </span>
            )}
          </div>
          <Button onClick={openCreate} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 cursor-text"
          />
        </div>
        
        <div className="flex gap-2">
          {(["all", "upcoming", "past"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="cursor-pointer capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
        <Popover open={dateFilterOpen} onOpenChange={setDateFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer gap-2 border-white/10 bg-[#080B0E] hover:bg-[#171717]"
            >
              <Filter className="w-4 h-4 text-white" />
              <span className="text-sm">
                {dateFrom && dateTo && dateOperator === "is_in_between"
                  ? `Date: ${formatDateLabel(dateFrom)} - ${formatDateLabel(dateTo)}`
                  : dateFrom && dateOperator !== "is_in_between"
                    ? `Date: ${DATE_OPERATORS.find((o) => o.id === dateOperator)?.label ?? ""} ${formatDateLabel(dateFrom)}`
                    : "Date"}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#080B0E] border-white/10" align="start">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/80">Start Date</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="cursor-pointer gap-1 min-w-[140px] justify-between bg-[#171717] border-white/10 text-white">
                        {DATE_OPERATORS.find((o) => o.id === dateOperator)?.label ?? "Is"}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-[#080B0E] border-white/10 text-white">
                      {DATE_OPERATORS.map((op) => (
                        <DropdownMenuItem key={op.id} onClick={() => setDateOperator(op.id)} className="cursor-pointer text-white focus:bg-white/10 focus:text-white">
                          {op.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <button
                  type="button"
                  onClick={() => { setDateFrom(undefined); setDateTo(undefined); setDateFilterOpen(false); }}
                  className="text-sm text-red-500 hover:text-red-400 cursor-pointer"
                >
                  Delete
                </button>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-white/80 mb-1">From</p>
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={(d) => setDateFrom(d ?? undefined)}
                    className="rounded-md border border-white/10"
                    classNames={{
                      caption_label: "text-white font-medium",
                      weekdays: "flex w-full justify-center",
                      weekday: "flex-1 min-w-(--cell-size) text-center text-white/70 text-[0.8rem]",
                      table: "pl-(--cell-size) pr-(--cell-size)",
                      day: "[&_button]:text-white [&_button]:hover:bg-white/10 [&_button]:hover:text-white [&[data-selected]_button]:bg-white/20 [&[data-selected]_button]:text-white",
                      outside: "[&_button]:text-white/40",
                      button_previous: "text-white hover:bg-white/10",
                      button_next: "text-white hover:bg-white/10",
                    }}
                  />
                </div>
                {dateOperator === "is_in_between" && (
                  <div>
                    <p className="text-xs text-white/80 mb-1">To</p>
                    <CalendarComponent
                      mode="single"
                      selected={dateTo}
                      onSelect={(d) => setDateTo(d ?? undefined)}
                      disabled={(d) => dateFrom ? d < dateFrom : false}
                      className="rounded-md border border-white/10"
                      classNames={{
                        caption_label: "text-white font-medium",
                        weekdays: "flex w-full justify-center",
                        weekday: "flex-1 min-w-(--cell-size) text-center text-white/70 text-[0.8rem]",
                        table: "pl-(--cell-size) pr-(--cell-size)",
                        day: "[&_button]:text-white [&_button]:hover:bg-white/10 [&_button]:hover:text-white [&[data-selected]_button]:bg-white [&[data-selected]_button]:text-black",
                        outside: "[&_button]:text-white/40",
                        button_previous: "text-white hover:bg-white/10",
                        button_next: "text-white hover:bg-white/10",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {events.length === 0 ? "No events yet." : "No events match your filters."}
        </p>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="flex flex-row items-start gap-4 p-4 overflow-hidden min-w-0 w-full max-w-full">
            {/* 1. Cover image */}
            <div className="size-24 shrink-0 rounded-lg bg-muted overflow-hidden">
              {event.image_url ? (
                <img src={event.image_url} alt="" className="w-full h-full object-cover object-center block" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground" /></div>
              )}
            </div>
            {/* 2. Event title, desc, date location */}
            <div className="flex-1 min-w-0 overflow-hidden min-h-0 py-1">
                <div className="flex items-center gap-2 mb-2 min-w-0 overflow-hidden">
                  <h3 className="text-base font-semibold truncate min-w-0 max-w-full" title={event.title}>
                    {event.title.length > 80 ? `${event.title.slice(0, 65)}...` : event.title}
                  </h3>
                  <span className={cn("shrink-0 px-2 py-0.5 rounded-full text-xs font-medium h-6 flex items-center justify-center", !isEventPast(event.date) ? "bg-green-500/10 text-green-500" : "bg-muted text-white")}>
                    {isEventPast(event.date) ? "Past" : "Upcoming"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground min-w-0 overflow-hidden">
                  <span className="flex items-center gap-1 shrink-0"><Calendar className="w-3 h-3" />{new Date(event.date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                  <span className="flex items-center gap-1 min-w-0 max-w-[500px] flex-1 overflow-hidden" title={event.location}>
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="min-w-0 max-w-full truncate">{event.location}</span>
                  </span>
                </div>
              </div>
            {/* 3. Action */}
            <div className="shrink-0 ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#080B0E] border-white/10 text-white/60 [&_svg]:text-white/60">
                  <DropdownMenuItem onClick={() => openEdit(event)} className="cursor-pointer text-white/60 focus:bg-[#171717] focus:text-white/60 [&_svg]:text-white/60"><Pencil className="w-4 h-4" /> Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openArchiveConfirm(event)} className="cursor-pointer text-white/60 focus:bg-[#171717] focus:text-white/60 [&_svg]:text-amber-500"><Archive className="w-4 h-4" /> Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#080B0E] border-border/50 text-foreground [&_input]:bg-[#171717] [&_input]:border-border/50 [&_textarea]:bg-[#171717] [&_textarea]:border-border/50 [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Event title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="cursor-text" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={6} className="flex min-h-[160px] w-full rounded-md border border-input bg-[#171717] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-text" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="cursor-pointer" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="cursor-text" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Luma URL</Label>
                <Input type="url" placeholder="https://lu.ma/..." value={formData.luma_url} onChange={(e) => setFormData({ ...formData, luma_url: e.target.value })} className="cursor-text" />
              </div>
              <div className="space-y-2">
                <Label>Attendees</Label>
                <Input type="number" min={0} placeholder="0" value={formData.attendee_count ?? ""} onChange={(e) => setFormData({ ...formData, attendee_count: e.target.value ? parseInt(e.target.value, 10) : null })} className="cursor-text" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cover image</Label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-lg bg-[#171717] overflow-hidden shrink-0">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-muted-foreground" /></div>
                  )}
                </div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
                  {isUploading ? "Uploading…" : "Upload image"}
                </Button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={formData.is_upcoming} onChange={(e) => setFormData({ ...formData, is_upcoming: e.target.checked })} className="rounded border-input cursor-pointer" /> Upcoming event
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">Cancel</Button>
            <Button onClick={handleSave} className="cursor-pointer">{editingEvent ? "Save" : "Add Event"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive confirmation modal */}
      <Dialog open={!!archiveConfirm} onOpenChange={(open) => !open && setArchiveConfirm(null)}>
        <DialogContent className="max-w-md bg-[#080B0E] border-white/10 text-foreground">
          <DialogHeader className="overflow-hidden min-w-0">
            <DialogTitle className="truncate" title={archiveConfirm?.title}>Archive {archiveConfirm?.title}?</DialogTitle>
            <p className="text-sm text-muted-foreground">It will be hidden from the landing page and won&apos;t be re-fetched on sync.</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveConfirm(null)} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">Cancel</Button>
            <Button onClick={handleArchiveConfirm} className="cursor-pointer">Archive</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating toast - top center, auto-dismiss with fade out */}
      {toast && (
        <div
          className={cn(
            "fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg border border-white/10 bg-[#080B0E] px-4 py-3 shadow-lg transition-all duration-300",
            toastExiting ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          )}
        >
          <p className={cn("text-sm font-medium", toast.type === "error" ? "text-destructive" : "text-foreground")}>
            {toast.message}
          </p>
        </div>
      )}
    </div>
  );
}
