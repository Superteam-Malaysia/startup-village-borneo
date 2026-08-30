"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, ExternalLink, FolderOpen, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Project, LookupTag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [toastExiting, setToastExiting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  const [formData, setFormData] = useState({ title: "", description: "", link: "" });
  const [initialFormState, setInitialFormState] = useState<{
    formData: { title: string; description: string; link: string };
    selectedSkills: MultiSelectOption[];
    selectedSubskills: MultiSelectOption[];
  } | null>(null);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);

  const [allSkills, setAllSkills] = useState<MultiSelectOption[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<MultiSelectOption[]>([]);
  const [allSubskills, setAllSubskills] = useState<MultiSelectOption[]>([]);
  const [selectedSubskills, setSelectedSubskills] = useState<MultiSelectOption[]>([]);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!toast) return;
    setToastExiting(false);
    toastTimeoutRef.current = setTimeout(() => {
      setToastExiting(true);
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
        setToastExiting(false);
      }, 300);
    }, 4000);
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [toast]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const [projectsRes, skillsRes, subskillsRes] = await Promise.all([
      supabase.from("projects").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }),
      supabase.from("skills").select("id, name").order("name"),
      supabase.from("subskills").select("id, name, skill_id").order("name"),
    ]);

    if (projectsRes.data) setProjects(projectsRes.data as Project[]);
    if (skillsRes.data) setAllSkills(skillsRes.data);
    if (subskillsRes.data) setAllSubskills(subskillsRes.data);
    setIsLoading(false);
  }

  function openCreate() {
    setEditingProject(null);
    const initial = { title: "", description: "", link: "" };
    setFormData(initial);
    setSelectedSkills([]);
    setSelectedSubskills([]);
    setInitialFormState({ formData: initial, selectedSkills: [], selectedSubskills: [] });
    setIsModalOpen(true);
  }

  async function openEdit(project: Project) {
    setEditingProject(project);
    setFormData({ title: project.title, description: project.description, link: project.link });

    const [skillsRes, subskillsRes] = await Promise.all([
      supabase.from("project_skills").select("skill_id, skills:skill_id(id, name)").eq("project_id", project.id),
      supabase.from("project_subskills").select("subskill_id, subskills:subskill_id(id, name)").eq("project_id", project.id),
    ]);

    const skills = (skillsRes.data || []).map((r: Record<string, unknown>) => r.skills as MultiSelectOption).filter(Boolean);
    const subskills = (subskillsRes.data || []).map((r: Record<string, unknown>) => r.subskills as MultiSelectOption).filter(Boolean);
    setSelectedSkills(skills);
    setSelectedSubskills(subskills);
    setInitialFormState({
      formData: { title: project.title, description: project.description, link: project.link },
      selectedSkills: skills,
      selectedSubskills: subskills,
    });
    setIsModalOpen(true);
  }

  function hasUnsavedChanges(): boolean {
    if (!initialFormState) return false;
    const { formData: init, selectedSkills: initSkills, selectedSubskills: initSubskills } = initialFormState;
    const ids = (arr: MultiSelectOption[]) => arr.map((s) => s.id).sort().join(",");
    return (
      formData.title !== init.title ||
      formData.description !== init.description ||
      formData.link !== init.link ||
      ids(selectedSkills) !== ids(initSkills) ||
      ids(selectedSubskills) !== ids(initSubskills)
    );
  }

  function handleModalOpenChange(open: boolean) {
    if (open) {
      setIsModalOpen(true);
      return;
    }
    if (hasUnsavedChanges()) {
      setShowUnsavedConfirm(true);
      return;
    }
    setIsModalOpen(false);
  }

  function handleDiscardAndClose() {
    setShowUnsavedConfirm(false);
    setIsModalOpen(false);
  }

  async function handleSave() {
    if (!userId) return;

    if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update(formData)
        .eq("id", editingProject.id);

      if (!error) {
        setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...formData } : p)));
        await saveProjectJunctions(editingProject.id);
        setToast({ message: "Project updated", type: "success" });
      }
    } else {
      const { data, error } = await supabase
        .from("projects")
        .insert({ ...formData, profile_id: userId })
        .select()
        .single();

      if (!error && data) {
        setProjects([data as Project, ...projects]);
        await saveProjectJunctions(data.id);
        setToast({ message: "Project added", type: "success" });
      }
    }
    setIsModalOpen(false);
  }

  async function saveProjectJunctions(projectId: string) {
    await supabase.from("project_skills").delete().eq("project_id", projectId);
    await supabase.from("project_subskills").delete().eq("project_id", projectId);

    if (selectedSkills.length > 0) {
      await supabase.from("project_skills").insert(
        selectedSkills.map((s) => ({ project_id: projectId, skill_id: s.id }))
      );
    }
    if (selectedSubskills.length > 0) {
      await supabase.from("project_subskills").insert(
        selectedSubskills.map((s) => ({ project_id: projectId, subskill_id: s.id }))
      );
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteConfirm) return;
    const { error } = await supabase.from("projects").delete().eq("id", deleteConfirm.id);
    if (!error) {
      setProjects(projects.filter((p) => p.id !== deleteConfirm.id));
      setToast({ message: "Project deleted", type: "success" });
    }
    setDeleteConfirm(null);
  }

  async function createTag(table: string, name: string): Promise<MultiSelectOption | null> {
    const { data, error } = await supabase.from(table).insert({ name }).select("id, name").single();
    if (error || !data) return null;
    if (table === "skills") setAllSkills((prev) => [...prev, data]);
    else if (table === "subskills") setAllSubskills((prev) => [...prev, data]);
    return data;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Showcase your proof of work</p>
        </div>
        <Button onClick={openCreate} className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No projects yet. Add your first project to showcase your work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="p-5 group">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold text-white">{project.title}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => openEdit(project)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer text-destructive hover:text-destructive"
                    onClick={() => setDeleteConfirm({ id: project.id, title: project.title })}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" /> View project
                </a>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#080B0E] border-border/50 text-foreground [&_input]:bg-[#171717] [&_input]:border-border/50 [&_textarea]:bg-[#171717] [&_textarea]:border-border/50 [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Project name" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="cursor-text" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                placeholder="What does this project do?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-[#171717] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input type="url" placeholder="https://..." value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="cursor-text" />
            </div>
            <div className="space-y-2">
              <Label>Skills</Label>
              <MultiSelect
                options={allSkills}
                selected={selectedSkills}
                onChange={setSelectedSkills}
                onCreateNew={(name) => createTag("skills", name)}
                placeholder="Select skills..."
                dropdownInPortal
              />
            </div>
            <div className="space-y-2">
              <Label>Subskills</Label>
              <MultiSelect
                options={allSubskills}
                selected={selectedSubskills}
                onChange={setSelectedSubskills}
                onCreateNew={(name) => createTag("subskills", name)}
                placeholder="Select subskills..."
                dropdownInPortal
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleModalOpenChange(false)} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
              Cancel
            </Button>
            <Button onClick={handleSave} className="cursor-pointer">
              {editingProject ? "Save Changes" : "Add Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUnsavedConfirm} onOpenChange={(open) => !open && setShowUnsavedConfirm(false)}>
        <DialogContent className="max-w-md bg-[#080B0E] border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <p className="text-sm text-muted-foreground">You have unsaved changes. Are you sure you want to close?</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnsavedConfirm(false)} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
              Keep editing
            </Button>
            <Button onClick={handleDiscardAndClose} variant="destructive" className="cursor-pointer">
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="max-w-md bg-[#080B0E] border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle className="truncate" title={deleteConfirm?.title}>
              Delete {deleteConfirm?.title}?
            </DialogTitle>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast && (
        <div className={cn("fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg border border-white/10 bg-[#080B0E] px-4 py-3 shadow-lg transition-all duration-300", toastExiting ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100")}>
          <p className={cn("text-sm font-medium", toast.type === "error" ? "text-destructive" : "text-foreground")}>{toast.message}</p>
        </div>
      )}
    </div>
  );
}
