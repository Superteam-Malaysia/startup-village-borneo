import { withBasePath } from "@/lib/base-path";

/** Turn a stored upload path into a browser URL under basePath. */
export function uploadPublicUrl(publicPath: string | null | undefined): string | null {
  if (!publicPath?.trim()) return null;
  return withBasePath(publicPath.startsWith("/") ? publicPath : `/${publicPath}`);
}
