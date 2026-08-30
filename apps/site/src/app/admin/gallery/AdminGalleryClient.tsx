"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, GripVertical, Loader2, Images } from "lucide-react";
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
import type { EventPhoto } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const BUCKET = "event-photos";
const MAX_MB = 8;

function SortablePhoto({
  photo,
  onDelete,
}: {
  photo: EventPhoto;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-50 z-10" : ""}
    >
      <Card className="p-0 overflow-hidden group relative">
        <div className="relative aspect-square bg-[#171717]">
          <Image
            src={photo.image_url}
            alt={photo.caption || ""}
            fill
            className="object-cover"
            unoptimized
            sizes="200px"
          />
        </div>

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none p-1.5 rounded bg-black/60 text-white/90 hover:text-white"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded bg-black/60 text-destructive hover:text-red-400 cursor-pointer"
            aria-label="Delete photo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}

interface AdminGalleryClientProps {
  initialPhotos: EventPhoto[];
}

export function AdminGalleryClient({ initialPhotos }: AdminGalleryClientProps) {
  const [photos, setPhotos] = useState<EventPhoto[]>(initialPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    e.target.value = "";
    if (files.length === 0) return;

    const tooBig = files.filter((f) => f.size > MAX_MB * 1024 * 1024);
    if (tooBig.length) {
      setError(`${tooBig.length} file(s) over ${MAX_MB}MB were skipped.`);
    } else {
      setError("");
    }
    const usable = files.filter((f) => f.size <= MAX_MB * 1024 * 1024);
    if (usable.length === 0) return;

    setIsUploading(true);
    setProgress({ done: 0, total: usable.length });

    const added: EventPhoto[] = [];
    let order = photos.length;

    for (const file of usable) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        setError(uploadError.message);
        break;
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      order += 1;

      const { data, error: insertError } = await supabase
        .from("event_photos")
        .insert({ image_url: urlData.publicUrl, display_order: order })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        break;
      }
      if (data) added.push(data as EventPhoto);
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    setPhotos((prev) => [...prev, ...added]);
    setIsUploading(false);
  }

  async function handleDelete(photo: EventPhoto) {
    if (!confirm("Remove this photo from the events gallery?")) return;

    const { error: deleteError } = await supabase
      .from("event_photos")
      .delete()
      .eq("id", photo.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    // Only storage-hosted files have something to clean up; the seeded
    // /images/events/*.jpeg rows point at files in the repo.
    const marker = `/${BUCKET}/`;
    if (photo.image_url.includes(marker)) {
      const path = photo.image_url.split(marker)[1];
      if (path) await supabase.storage.from(BUCKET).remove([path]);
    }

    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = photos.findIndex((p) => p.id === active.id);
    const newIndex = photos.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(photos, oldIndex, newIndex);
    setPhotos(reordered);

    await Promise.all(
      reordered.map((p, i) =>
        supabase.from("event_photos").update({ display_order: i + 1 }).eq("id", p.id)
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
          <h1 className="text-2xl font-bold">Event Gallery</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Photos in the rotating dome on the landing page. Drag to reorder.
          </p>
        </div>
        <div className="shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="cursor-pointer"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ImagePlus className="w-4 h-4 mr-2" />
            )}
            {isUploading
              ? `Uploading ${progress.done}/${progress.total}...`
              : "Upload Photos"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <p className="text-sm text-muted-foreground">
          {photos.length} photo{photos.length === 1 ? "" : "s"}
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {photos.length === 0 ? (
        <Card className="p-10 flex flex-col items-center text-center gap-2">
          <Images className="w-6 h-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No photos yet. Upload some to fill the events dome.
          </p>
        </Card>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {photos.map((photo) => (
                <SortablePhoto
                  key={photo.id}
                  photo={photo}
                  onDelete={() => handleDelete(photo)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
