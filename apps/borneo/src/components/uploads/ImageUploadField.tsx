"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { withBasePath } from "@/lib/base-path";

type ImageUploadFieldProps = {
  label: string;
  hint?: string;
  uploadUrl: string;
  imageUrl: string | null;
  fallbackLabel: string;
  shape?: "circle" | "square";
  inputId: string;
};

export function ImageUploadField({
  label,
  hint,
  uploadUrl,
  imageUrl,
  fallbackLabel,
  shape = "circle",
  inputId,
}: ImageUploadFieldProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageBroken, setImageBroken] = useState(false);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    setUploading(true);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const body = new FormData();
      body.set("file", file);

      const res = await fetch(withBasePath(uploadUrl), {
        method: "POST",
        body,
      });
      const data = (await res.json()) as {
        error?: string;
        avatarUrl?: string;
        logoUrl?: string;
      };

      if (!res.ok) {
        setPreviewUrl(imageUrl);
        setError(data.error ?? "Upload failed.");
        return;
      }

      const nextUrl = data.avatarUrl ?? data.logoUrl ?? null;
      setPreviewUrl(nextUrl);
      router.refresh();
    } catch {
      setPreviewUrl(imageUrl);
      setError("Upload failed. Try again.");
    } finally {
      URL.revokeObjectURL(localPreview);
      setUploading(false);
    }
  }

  const frameClass =
    shape === "square" ? "image-upload__frame image-upload__frame--square" : "image-upload__frame";

  return (
    <div className="image-upload">
      <span className="image-upload__label">{label}</span>
      <div className="image-upload__row">
        <div className={frameClass}>
          {previewUrl && !imageBroken ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              className="image-upload__photo"
              onError={() => {
                setImageBroken(true);
                setPreviewUrl(null);
              }}
            />
          ) : (
            <span className="image-upload__fallback" aria-hidden="true">
              {fallbackLabel}
            </span>
          )}
        </div>
        <div className="image-upload__actions">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="image-upload__input"
            onChange={(event) => void onFileChange(event)}
          />
          <button
            type="button"
            className="image-upload__button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading…" : previewUrl ? "Replace image" : "Upload image"}
          </button>
          {hint ? <p className="image-upload__hint">{hint}</p> : null}
          {error ? <p className="image-upload__error">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
