export const dynamic = "force-dynamic";

import { AdminGalleryClient } from "@/app/admin/gallery/AdminGalleryClient";
import { getEventPhotos } from "@/lib/supabase/queries";

export default async function GalleryPage() {
  const photos = await getEventPhotos();
  return <AdminGalleryClient initialPhotos={photos} />;
}
