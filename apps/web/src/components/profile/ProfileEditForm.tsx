"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/uploads/ImageUploadField";
import { withBasePath } from "@/lib/base-path";
import type { ProfileFormValues, ProfileReadonlyMeta } from "@/lib/profile/form";

type ProfileEditFormProps = {
  initial: ProfileFormValues;
  meta: ProfileReadonlyMeta;
  avatarUrl: string | null;
  avatarFallback: string;
};

export function ProfileEditForm({ initial, meta, avatarUrl, avatarFallback }: ProfileEditFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProfileFormValues>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function update(field: keyof ProfileFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await fetch(withBasePath("/api/profile"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await res.json()) as { error?: string; profile?: ProfileFormValues };

    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save profile.");
      return;
    }

    if (data.profile) setValues(data.profile);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="team-form profile-form">
      {error ? <p className="team-form__error">{error}</p> : null}
      {saved ? (
        <p className="profile-form__saved">Profile saved.</p>
      ) : null}

      <ImageUploadField
        inputId="profile-avatar-upload"
        label="Profile photo"
        hint="JPG, PNG, WebP, or GIF · max 1 MB. Stored in the event database — no extra storage fees."
        uploadUrl="/api/profile/avatar"
        imageUrl={avatarUrl}
        fallbackLabel={avatarFallback}
      />

      <div className="profile-form__readonly">
        <p>
          <span className="team-form__label">Email</span>
          <span className="profile-form__readonly-value">{meta.email}</span>
        </p>
        <p>
          <span className="team-form__label">Registration</span>
          <span className="profile-form__readonly-value">
            {meta.approvalStatus ?? "guest"} · {meta.ticketName ?? "Standard"}
          </span>
        </p>
      </div>

      <label className="team-form__field">
        <span className="team-form__label">Display name</span>
        <input
          type="text"
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className="team-form__input"
        />
      </label>

      <label className="team-form__field">
        <span className="team-form__label">Phone</span>
        <input
          type="tel"
          value={values.phoneNumber}
          onChange={(e) => update("phoneNumber", e.target.value)}
          className="team-form__input"
          placeholder="+60 …"
        />
      </label>

      <label className="team-form__field">
        <span className="team-form__label">Telegram</span>
        <input
          type="text"
          value={values.telegram}
          onChange={(e) => update("telegram", e.target.value)}
          className="team-form__input"
          placeholder="@username or t.me/…"
        />
      </label>

      <div className="profile-form__row">
        <label className="team-form__field">
          <span className="team-form__label">Passport / IC first name</span>
          <input
            type="text"
            value={values.passportFirstName}
            onChange={(e) => update("passportFirstName", e.target.value)}
            className="team-form__input"
          />
        </label>
        <label className="team-form__field">
          <span className="team-form__label">Passport / IC last name</span>
          <input
            type="text"
            value={values.passportLastName}
            onChange={(e) => update("passportLastName", e.target.value)}
            className="team-form__input"
          />
        </label>
      </div>

      <label className="team-form__field">
        <span className="team-form__label">Project idea</span>
        <textarea
          value={values.projectIdea}
          onChange={(e) => update("projectIdea", e.target.value)}
          className="team-form__textarea"
          rows={4}
        />
      </label>

      <label className="team-form__field">
        <span className="team-form__label">Proof of work</span>
        <textarea
          value={values.proofOfWork}
          onChange={(e) => update("proofOfWork", e.target.value)}
          className="team-form__textarea"
          rows={3}
          placeholder="Links to GitHub, demos, posts…"
        />
      </label>

      <label className="team-form__field">
        <span className="team-form__label">Team setup</span>
        <textarea
          value={values.teamSetup}
          onChange={(e) => update("teamSetup", e.target.value)}
          className="team-form__textarea"
          rows={2}
        />
      </label>

      <label className="team-form__field">
        <span className="team-form__label">Commitment proof</span>
        <textarea
          value={values.commitmentProof}
          onChange={(e) => update("commitmentProof", e.target.value)}
          className="team-form__textarea"
          rows={2}
        />
      </label>

      <div className="profile-form__row">
        <label className="team-form__field">
          <span className="team-form__label">Jersey size</span>
          <input
            type="text"
            value={values.jerseySize}
            onChange={(e) => update("jerseySize", e.target.value)}
            className="team-form__input"
            placeholder="M, L, XL…"
          />
        </label>
        <label className="team-form__field">
          <span className="team-form__label">Own accommodation</span>
          <input
            type="text"
            value={values.ownAccommodation}
            onChange={(e) => update("ownAccommodation", e.target.value)}
            className="team-form__input"
            placeholder="Yes / No / details"
          />
        </label>
      </div>

      <div className="team-form__actions">
        <button type="submit" disabled={saving} className="cta cta--byte cta--md disabled:opacity-50">
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
