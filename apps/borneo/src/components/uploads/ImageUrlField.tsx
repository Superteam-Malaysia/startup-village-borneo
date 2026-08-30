"use client";

type ImageUrlFieldProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  fallbackLabel: string;
  placeholder?: string;
  shape?: "circle" | "square";
};

function previewUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) return trimmed;
  return null;
}

export function ImageUrlField({
  label,
  hint,
  value,
  onChange,
  fallbackLabel,
  placeholder = "https://…",
  shape = "circle",
}: ImageUrlFieldProps) {
  const preview = previewUrl(value);
  const frameClass =
    shape === "square" ? "image-upload__frame image-upload__frame--square" : "image-upload__frame";

  return (
    <div className="image-upload">
      <span className="image-upload__label">{label}</span>
      <div className="image-upload__row">
        <div className={frameClass}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="image-upload__photo" />
          ) : (
            <span className="image-upload__fallback" aria-hidden="true">
              {fallbackLabel}
            </span>
          )}
        </div>
        <div className="image-upload__actions">
          <input
            type="url"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="team-form__input"
            placeholder={placeholder}
            inputMode="url"
            autoComplete="url"
          />
          {hint ? <p className="image-upload__hint">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}
