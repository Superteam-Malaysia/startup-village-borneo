"use client";

import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, ImageIcon, GripVertical } from "lucide-react";
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
  rectSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/lib/supabase/client";
import type { Partner } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PartnerLogoEditor } from "@/components/admin/PartnerLogoEditor";

interface AdminPartnersClientProps {
  initialPartners: Partner[];
}

function SortablePartnerCard({
  partner,
  onEdit,
  onDelete,
}: {
  partner: Partner;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: partner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`p-3 py-5 group ${isDragging ? "opacity-50 shadow-lg z-10" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground shrink-0"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div className="w-20 h-12 rounded-sm bg-background flex items-center justify-center overflow-hidden shrink-0 p-1">
            {partner.logo_url ? (
              <img src={partner.logo_url} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">{partner.name.charAt(0)}</span>
            )}
          </div>
          <h3 className="text-sm font-semibold truncate">{partner.name}</h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={onEdit}><Pencil className="w-3.5 h-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer" onClick={onDelete}><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
      </div>
    </Card>
    </div>
  );
}

export function AdminPartnersClient({ initialPartners }: AdminPartnersClientProps) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    website_url: "",
    logo_url: "",
  });

  function openCreate() {
    setEditingPartner(null);
    setFormData({ name: "", website_url: "", logo_url: "" });
    setIsModalOpen(true);
  }

  function openEdit(partner: Partner) {
    setEditingPartner(partner);
    setFormData({ name: partner.name, website_url: partner.website_url, logo_url: partner.logo_url || "" });
    setIsModalOpen(true);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setPendingImageFile(file);
    setEditorOpen(true);
    e.target.value = "";
  }

  async function handleEditorComplete(blob: Blob) {
    setIsUploading(true);
    try {
      const ext = "png";
      const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error } = await supabase.storage.from("partner-logos").upload(path, blob, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("partner-logos").getPublicUrl(path);
      setFormData((prev) => ({ ...prev, logo_url: urlData.publicUrl }));
    } finally {
      setIsUploading(false);
      setPendingImageFile(null);
    }
  }

  async function handleSave() {
    const payload = { name: formData.name, website_url: formData.website_url, logo_url: formData.logo_url || "/images/partners/placeholder.svg" };
    if (editingPartner) {
      const { error } = await supabase
        .from("partners")
        .update(payload)
        .eq("id", editingPartner.id);

      if (!error) {
        setPartners(partners.map((p) => (p.id === editingPartner.id ? { ...p, ...payload } : p)));
      }
    } else {
      const { data, error } = await supabase
        .from("partners")
        .insert({
          ...payload,
          display_order: partners.length + 1,
        })
        .select()
        .single();

      if (!error && data) {
        setPartners([...partners, data as Partner]);
      }
    }
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this partner?")) {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (!error) {
        setPartners(partners.filter((p) => p.id !== id));
      }
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = partners.findIndex((p) => p.id === active.id);
    const newIndex = partners.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(partners, oldIndex, newIndex);
    setPartners(reordered);

    const updates = reordered.map((p, i) =>
      supabase.from("partners").update({ display_order: i + 1 }).eq("id", p.id)
    );
    await Promise.all(updates);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Partners</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage ecosystem partners and sponsors. Drag the grip icon to reorder.</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Add Partner</Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={partners.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner) => (
              <SortablePartnerCard
                key={partner.id}
                partner={partner}
                onEdit={() => openEdit(partner)}
                onDelete={() => handleDelete(partner.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#080B0E] border-border/50 text-foreground [&_input]:bg-[#171717] [&_input]:border-border/50 [&_textarea]:bg-[#171717] [&_textarea]:border-border/50 [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>{editingPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Logo</Label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-lg bg-[#171717] overflow-hidden shrink-0">
                  {formData.logo_url ? (
                    <img src={formData.logo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-muted-foreground" /></div>
                  )}
                </div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
                  {isUploading ? "Uploading…" : "Upload image"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Partner name</Label>
              <Input placeholder="Partner name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="cursor-text" />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input type="url" placeholder="https://..." value={formData.website_url} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} className="cursor-text" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">Cancel</Button>
            <Button onClick={handleSave} className="cursor-pointer">{editingPartner ? "Save" : "Add Partner"}</Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>

      <PartnerLogoEditor
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setPendingImageFile(null);
        }}
        imageFile={pendingImageFile}
        onComplete={handleEditorComplete}
      />
    </div>
  );
}
