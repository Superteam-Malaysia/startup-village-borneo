/** Mirrors `basePath` in next.config.ts — set via NEXT_PUBLIC_BASE_PATH. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative public asset path for deployment under basePath. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || !BASE_PATH) {
    return path;
  }
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) {
    return path;
  }
  return `${BASE_PATH}${path}`;
}
