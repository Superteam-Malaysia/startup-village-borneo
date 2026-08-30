"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Check, ImageIcon, Plus, Trash2, GripVertical, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { SiteContent, FAQ, MissionPillar } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SECTION_KEYS = [
  "hero",
  "who_we_are",
  "mission",
  "stats",
  "events",
  "members_spotlight",
  "partners",
  "wall_of_love",
  "faq_section",
] as const;

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Section",
  who_we_are: "Who We Are",
  mission: "Mission (4 Pillars)",
  stats: "Stats Section",
  events: "Events Section",
  members_spotlight: "Member Spotlight",
  partners: "Partners Section",
  wall_of_love: "Wall of Love",
  faq_section: "FAQ Section Header",
};

interface AdminContentClientProps {
  initialSiteContent?: Record<string, SiteContent>;
  initialFAQs?: FAQ[];
}

function getDefaultContent(sectionKey: string): Partial<SiteContent> {
  const defaults: Record<string, Partial<SiteContent>> = {
    hero: { title: "THE HOME OF SOLANA", subtitle: "BUILDERS IN MALAYSIA", description: "We connect local talent with global opportunities. Build, earn, and grow alongside Malaysia's most ambitious web3 community." },
    who_we_are: { description: "Superteam Malaysia is a gateway for Malaysian builders to step into the global Web3 ecosystem — learning together, building real products, earning through meaningful opportunities, and growing as a community." },
    mission: {
      title: "Empowering Malaysia's",
      subtitle: "Solana Builders",
      content: {
        pillars: [
          { title: "LEARN", description: "Learn through hands-on education, workshops, and mentorship from experienced builders across the ecosystem.", image_url: "/images/learn.jpeg" },
          { title: "BUILD", description: "Build alongside the community through hackathons, collaborative events, and real projects that turn ideas into production-ready products.", image_url: "/images/build.jpeg" },
          { title: "GROW", description: "Grow your career and network through strong ecosystem connections and long-term opportunities, locally and globally.", image_url: "/images/grow.jpeg" },
          { title: "EARN", description: "Earn through grants, funding access, jobs, and bounties by contributing to impactful Web3 projects.", image_url: "/images/earn.jpeg" },
        ],
      },
    },
    stats: { title: "Powered by Builders", description: "From local meetups to global opportunities, our community continues to grow through shipped projects, hosted events, and meaningful contributions across the ecosystem." },
    events: { title: "Our Events", description: "Bringing the community together through meetups, workshops, hackathons, and builder gatherings." },
    members_spotlight: { title: "Member Spotlight", description: "Meet the talented builders driving the Solana ecosystem in Malaysia" },
    partners: { title: "Ecosystem Partners", description: "Partners that support the Malaysian builder ecosystem through tools, mentorship, and opportunities." },
    wall_of_love: { title: "Wall of Love", description: "Hear from our builders and leaders in the Malaysian Solana ecosystem!" },
    faq_section: { title: "HAVE QUESTIONS THAT NEED ANSWER?" },
  };
  return defaults[sectionKey] ?? {};
}

function SortableFAQItem({
  faq,
  onEdit,
  onDelete,
}: {
  faq: FAQ;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: faq.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style}>
      <div className={`flex items-center gap-2 p-3 rounded-lg border bg-card ${isDragging ? "opacity-50" : ""}`}>
        <button type="button" className="cursor-grab touch-none p-1" {...attributes} {...listeners} aria-label="Reorder">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{faq.question}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{faq.answer}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onEdit} aria-label="Edit">
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={onDelete}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function AdminContentClient({ initialSiteContent = {}, initialFAQs = [] }: AdminContentClientProps) {
  const [content, setContent] = useState<Record<string, SiteContent>>(initialSiteContent);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: contentData } = await supabase.from("site_content").select("*");
      const { data: faqsData } = await supabase.from("faqs").select("*").order("display_order", { ascending: true });
      if (contentData) {
        const map: Record<string, SiteContent> = {};
        for (const row of contentData as SiteContent[]) {
          map[row.section_key] = row;
        }
        setContent(map);
      }
      if (faqsData) setFaqs(faqsData as FAQ[]);
      setLoading(false);
    }
    if (Object.keys(initialSiteContent).length === 0 && initialFAQs.length === 0) {
      load();
    }
  }, [initialSiteContent, initialFAQs]);

  function getSection(sectionKey: string): SiteContent {
    const existing = content[sectionKey];
    const defaults = getDefaultContent(sectionKey);
    return {
      id: existing?.id ?? "",
      section_key: sectionKey,
      title: existing?.title ?? defaults.title ?? "",
      subtitle: existing?.subtitle ?? defaults.subtitle ?? "",
      description: existing?.description ?? defaults.description ?? "",
      cta_text: existing?.cta_text ?? "",
      cta_url: existing?.cta_url ?? "",
      image_url: existing?.image_url ?? "",
      content: existing?.content ?? defaults.content ?? {},
    } as SiteContent;
  }

  function handleUpdate(sectionKey: string, field: keyof SiteContent, value: string | Record<string, unknown>) {
    const s = getSection(sectionKey);
    setContent({
      ...content,
      [sectionKey]: { ...s, [field]: value },
    });
  }

  function handleMissionPillarUpdate(pillarIndex: number, field: keyof MissionPillar, value: string) {
    const s = getSection("mission");
    const pillars = ((s.content as { pillars?: MissionPillar[] })?.pillars ?? []) as MissionPillar[];
    const updated = [...pillars];
    if (!updated[pillarIndex]) updated[pillarIndex] = { title: "", description: "", image_url: "" };
    updated[pillarIndex] = { ...updated[pillarIndex], [field]: value };
    handleUpdate("mission", "content", { ...(s.content as object), pillars: updated });
  }

  async function handleSave(sectionKey: string) {
    const s = getSection(sectionKey);
    const payload = {
      section_key: sectionKey,
      title: s.title,
      subtitle: s.subtitle,
      description: s.description,
      content: s.content ?? {},
    };
    const { error } = await supabase.from("site_content").upsert(payload, { onConflict: "section_key" });
    if (error) {
      console.error("Save failed:", error);
      return;
    }
    setSaved(sectionKey);
    setTimeout(() => setSaved(null), 2000);
  }

  async function uploadPillarImage(pillarIndex: number, file: File) {
    const path = `pillars/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("landing-images").upload(path, file, { upsert: true });
    if (error) {
      console.error("Upload failed:", error);
      return;
    }
    const { data } = supabase.storage.from("landing-images").getPublicUrl(path);
    handleMissionPillarUpdate(pillarIndex, "image_url", data.publicUrl);
  }

  function openFaqModal(faq?: FAQ) {
    setEditingFaq(faq ?? null);
    setFaqForm({ question: faq?.question ?? "", answer: faq?.answer ?? "" });
    setFaqModalOpen(true);
  }

  async function saveFaq() {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;
    if (editingFaq) {
      const { error } = await supabase.from("faqs").update({ question: faqForm.question, answer: faqForm.answer }).eq("id", editingFaq.id);
      if (!error) {
        setFaqs(faqs.map((f) => (f.id === editingFaq.id ? { ...f, question: faqForm.question, answer: faqForm.answer } : f)));
      }
    } else {
      const { data, error } = await supabase.from("faqs").insert({ question: faqForm.question, answer: faqForm.answer, display_order: faqs.length }).select().single();
      if (!error && data) setFaqs([...faqs, data as FAQ]);
    }
    setFaqModalOpen(false);
  }

  async function deleteFaq(id: string) {
    await supabase.from("faqs").delete().eq("id", id);
    setFaqs(faqs.filter((f) => f.id !== id));
  }

  const faqSensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function handleFaqDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = faqs.findIndex((f) => f.id === active.id);
    const newIndex = faqs.findIndex((f) => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(faqs, oldIndex, newIndex);
    setFaqs(reordered);
    reordered.forEach(async (f, i) => {
      await supabase.from("faqs").update({ display_order: i }).eq("id", f.id);
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Site Content</h1>
        <p className="text-sm text-muted-foreground mt-1">Edit landing page text content. Changes appear on the homepage.</p>
      </div>

      <div className="space-y-6">
        {SECTION_KEYS.filter((k) => k !== "faq_section").map((sectionKey) => {
          const s = getSection(sectionKey);
          const isMission = sectionKey === "mission";
          const pillars = (s.content as { pillars?: MissionPillar[] })?.pillars ?? [];

          return (
            <Card key={sectionKey}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{SECTION_LABELS[sectionKey]}</CardTitle>
                <Button variant={saved === sectionKey ? "secondary" : "outline"} size="sm" onClick={() => handleSave(sectionKey)} disabled={saved === sectionKey}>
                  {saved === sectionKey ? <Check className="w-3 h-3 mr-2" /> : <Save className="w-3 h-3 mr-2" />}
                  {saved === sectionKey ? "Saved!" : "Save"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {sectionKey === "who_we_are" ? (
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <textarea value={s.description} onChange={(e) => handleUpdate(sectionKey, "description", e.target.value)} rows={4} className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
                  </div>
                ) : isMission ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title (Line 1)</Label>
                        <Input value={s.title} onChange={(e) => handleUpdate(sectionKey, "title", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle (Line 2)</Label>
                        <Input value={s.subtitle} onChange={(e) => handleUpdate(sectionKey, "subtitle", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label>4 Pillars</Label>
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Pillar {i + 1}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input value={pillars[i]?.title ?? ""} onChange={(e) => handleMissionPillarUpdate(i, "title", e.target.value)} placeholder="e.g. LEARN" className="h-9" />
                            </div>
                            <div className="space-y-2">
                              <Label>Image</Label>
                              <div className="flex gap-2 items-center min-h-9">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  ref={(el) => { fileInputRefs.current[`pillar-${i}`] = el; }}
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) uploadPillarImage(i, f);
                                  }}
                                />
                                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRefs.current[`pillar-${i}`]?.click()}>
                                  <ImageIcon className="w-4 h-4 mr-2" />
                                  Upload
                                </Button>
                                {pillars[i]?.image_url && (
                                  <img src={pillars[i].image_url} alt="" className="w-16 h-16 object-cover rounded" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <textarea value={pillars[i]?.description ?? ""} onChange={(e) => handleMissionPillarUpdate(i, "description", e.target.value)} rows={2} className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {(sectionKey === "hero" || sectionKey === "stats" || sectionKey === "events" || sectionKey === "members_spotlight" || sectionKey === "partners" || sectionKey === "wall_of_love") && (
                      <>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input value={s.title} onChange={(e) => handleUpdate(sectionKey, "title", e.target.value)} />
                        </div>
                        {sectionKey === "hero" && (
                          <div className="space-y-2">
                            <Label>Subtitle (Line 2)</Label>
                            <Input value={s.subtitle} onChange={(e) => handleUpdate(sectionKey, "subtitle", e.target.value)} />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <textarea value={s.description} onChange={(e) => handleUpdate(sectionKey, "description", e.target.value)} rows={3} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* FAQ Section Header */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>FAQ Section Header</CardTitle>
            <Button variant={saved === "faq_section" ? "secondary" : "outline"} size="sm" onClick={() => handleSave("faq_section")} disabled={saved === "faq_section"}>
              {saved === "faq_section" ? <Check className="w-3 h-3 mr-2" /> : <Save className="w-3 h-3 mr-2" />}
              {saved === "faq_section" ? "Saved!" : "Save"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={getSection("faq_section").title} onChange={(e) => handleUpdate("faq_section", "title", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* FAQs CRUD */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>FAQ Questions & Answers</CardTitle>
            <Button onClick={() => openFaqModal()}>
              <Plus className="w-3 h-3 mr-2" />
              Add FAQ
            </Button>
          </CardHeader>
          <CardContent>
            <DndContext sensors={faqSensors} collisionDetection={closestCenter} onDragEnd={handleFaqDragEnd}>
              <SortableContext items={faqs.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {faqs.map((faq) => (
                    <SortableFAQItem key={faq.id} faq={faq} onEdit={() => openFaqModal(faq)} onDelete={() => deleteFaq(faq.id)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </div>

      <Dialog open={faqModalOpen} onOpenChange={setFaqModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input value={faqForm.question} onChange={(e) => setFaqForm((p) => ({ ...p, question: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <textarea value={faqForm.answer} onChange={(e) => setFaqForm((p) => ({ ...p, answer: e.target.value }))} rows={4} className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqModalOpen(false)}>Cancel</Button>
            <Button onClick={saveFaq}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
