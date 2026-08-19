"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CtaButton } from "@/components/ui";
import { withBasePath } from "@/lib/base-path";
import { TEAM_CATEGORIES } from "@/lib/teams/types";

type TeamFormValues = {
  name: string;
  tagline: string;
  description: string;
  category: string;
  websiteUrl: string;
  proofUrl: string;
};

type TeamFormProps = {
  mode: "create" | "edit";
  slug?: string;
  initial?: Partial<TeamFormValues>;
};

const EMPTY: TeamFormValues = {
  name: "",
  tagline: "",
  description: "",
  category: "Other",
  websiteUrl: "",
  proofUrl: "",
};

export function TeamForm({ mode, slug, initial }: TeamFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<TeamFormValues>({ ...EMPTY, ...initial });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(field: keyof TeamFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const url =
      mode === "create"
        ? withBasePath("/api/teams")
        : withBasePath(`/api/teams/${slug}`);
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await res.json()) as { error?: string; team?: { slug: string } };

    if (!res.ok) {
      setSaving(false);
      setError(data.error ?? "Something went wrong.");
      return;
    }

    const nextSlug = data.team?.slug ?? slug;
    router.push(`/teams/${nextSlug}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="team-form">
      {error ? <p className="team-form__error">{error}</p> : null}

      <label className="team-form__field">
        <span className="team-form__label">Team name</span>
        <input
          type="text"
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className="team-form__input"
          placeholder="Imperial Perps"
        />
      </label>

      <label className="team-form__field">
        <span className="team-form__label">Tagline</span>
        <input
          type="text"
          value={values.tagline}
          onChange={(e) => update("tagline", e.target.value)}
          className="team-form__input"
          placeholder="One line about what you are building"
        />
      </label>

      <label className="team-form__field">
        <span className="team-form__label">Description</span>
        <textarea
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="team-form__textarea"
          placeholder="Longer project description"
        />
      </label>

      <label className="team-form__field">
        <span className="team-form__label">Category</span>
        <select
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
          className="team-form__select"
        >
          {TEAM_CATEGORIES.filter((c) => c !== "All").map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>

      <label className="team-form__field">
        <span className="team-form__label">Website</span>
        <input
          type="url"
          value={values.websiteUrl}
          onChange={(e) => update("websiteUrl", e.target.value)}
          className="team-form__input"
          placeholder="https://"
        />
      </label>

      <label className="team-form__field">
        <span className="team-form__label">Proof of work</span>
        <input
          type="url"
          value={values.proofUrl}
          onChange={(e) => update("proofUrl", e.target.value)}
          className="team-form__input"
          placeholder="GitHub, demo, or X link"
        />
      </label>

      <div className="team-form__actions">
        <button
          type="submit"
          disabled={saving}
          className="cta cta--byte cta--md disabled:opacity-50"
        >
          {saving ? "Saving…" : mode === "create" ? "Create team" : "Save changes"}
        </button>
        <CtaButton
          href={mode === "edit" && slug ? `/teams/${slug}` : "/teams"}
          variant="ghost-wisp"
          size="md"
          showArrow={false}
        >
          Cancel
        </CtaButton>
      </div>
    </form>
  );
}
