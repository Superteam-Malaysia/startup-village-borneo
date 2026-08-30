"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, BarChart3 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/lib/supabase/client";
import type { Stat } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EMPTY_FORM = { label: "", value: "0", suffix: "" };

function SortableStatRow({
  stat,
  onEdit,
  onDelete,
}: {
  stat: Stat;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: stat.id });

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
      <Card className={`p-4 group ${isDragging ? "opacity-50 shadow-lg z-10" : ""}`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground shrink-0"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* Mirrors how the landing page renders it: value + suffix, label under. */}
          <div className="shrink-0 w-32 text-center">
            <p className="text-2xl font-black text-foreground font-[family-name:var(--font-orbitron)] leading-none">
              {stat.value}
              {stat.suffix}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1.5">
              {stat.label}
            </p>
          </div>

          <div className="flex-1 min-w-0" />

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={onEdit}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
              onClick={onDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface AdminStatsClientProps {
  initialStats: Stat[];
}

export function AdminStatsClient({ initialStats }: AdminStatsClientProps) {
  const [stats, setStats] = useState<Stat[]>(initialStats);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Stat | null>(null);

  function openCreate() {
    setEditingStat(null);
    setFormData(EMPTY_FORM);
    setError("");
    setIsModalOpen(true);
  }

  function openEdit(stat: Stat) {
    setEditingStat(stat);
    setFormData({
      label: stat.label,
      value: String(stat.value),
      suffix: stat.suffix || "",
    });
    setError("");
    setIsModalOpen(true);
  }

  async function handleSave() {
    const label = formData.label.trim();
    if (!label) {
      setError("Label is required.");
      return;
    }
    // The column is an INTEGER, so reject anything that would round or NaN.
    const value = Number(formData.value);
    if (!Number.isInteger(value) || value < 0) {
      setError("Value must be a whole number of 0 or more.");
      return;
    }

    const payload = { label, value, suffix: formData.suffix.trim() };

    if (editingStat) {
      const { error: updateError } = await supabase
        .from("stats")
        .update(payload)
        .eq("id", editingStat.id);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setStats((prev) =>
        prev.map((s) => (s.id === editingStat.id ? { ...s, ...payload } : s))
      );
    } else {
      const { data, error: insertError } = await supabase
        .from("stats")
        .insert({ ...payload, display_order: stats.length + 1 })
        .select()
        .single();
      if (insertError) {
        setError(insertError.message);
        return;
      }
      if (data) setStats((prev) => [...prev, data as Stat]);
    }

    setIsModalOpen(false);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const { error: deleteError } = await supabase
      .from("stats")
      .delete()
      .eq("id", pendingDelete.id);
    if (!deleteError) {
      setStats((prev) => prev.filter((s) => s.id !== pendingDelete.id));
    }
    setPendingDelete(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stats.findIndex((s) => s.id === active.id);
    const newIndex = stats.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(stats, oldIndex, newIndex);
    setStats(reordered);

    await Promise.all(
      reordered.map((s, i) =>
        supabase.from("stats").update({ display_order: i + 1 }).eq("id", s.id)
      )
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Landing Page Stats</h1>
          <p className="text-sm text-muted-foreground mt-1">
            The counter row on the landing page. These are typed in by hand —
            nothing here is calculated from live data.
          </p>
        </div>
        <Button onClick={openCreate} className="cursor-pointer shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Add Stat
        </Button>
      </div>

      {stats.length === 0 ? (
        <Card className="p-10 flex flex-col items-center text-center gap-2">
          <BarChart3 className="w-6 h-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No stats yet. The counter row will be hidden on the landing page.
          </p>
        </Card>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={stats.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {stats.map((stat) => (
                <SortableStatRow
                  key={stat.id}
                  stat={stat}
                  onEdit={() => openEdit(stat)}
                  onDelete={() => setPendingDelete(stat)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg bg-background border-border/50 text-foreground [&_input]:bg-[#171717] [&_input]:border-border/50 [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>{editingStat ? "Edit Stat" : "Add Stat"}</DialogTitle>
            <DialogDescription>
              Value and suffix are shown together, e.g. 20 and &quot;+&quot; render as
              &quot;20+&quot;.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder="Events Hosted"
                value={formData.label}
                onChange={(e) => {
                  setFormData({ ...formData, label: e.target.value });
                  setError("");
                }}
                className="cursor-text"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="20"
                  value={formData.value}
                  onChange={(e) => {
                    setFormData({ ...formData, value: e.target.value });
                    setError("");
                  }}
                  className="cursor-text"
                />
              </div>
              <div className="space-y-2">
                <Label>Suffix</Label>
                <Input
                  placeholder="+"
                  value={formData.suffix}
                  onChange={(e) => {
                    setFormData({ ...formData, suffix: e.target.value });
                    setError("");
                  }}
                  className="cursor-text"
                />
              </div>
            </div>

            <div className="rounded-lg border border-border/50 bg-[#171717] p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Preview
              </p>
              <p className="text-3xl font-black text-foreground font-[family-name:var(--font-orbitron)] leading-none">
                {formData.value || "0"}
                {formData.suffix}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">
                {formData.label || "Label"}
              </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer bg-background border-border/50 hover:bg-[#171717] hover:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="cursor-pointer">
              {editingStat ? "Save Changes" : "Add Stat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent className="max-w-md bg-background border-border/50 text-foreground [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Delete stat?</DialogTitle>
            <DialogDescription>
              &quot;{pendingDelete?.label}&quot; will be removed from the landing page.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingDelete(null)}
              className="cursor-pointer bg-background border-border/50 hover:bg-[#171717] hover:text-white"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="cursor-pointer">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
