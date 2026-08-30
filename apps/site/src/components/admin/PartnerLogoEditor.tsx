"use client";

import { useState, useCallback, useRef } from "react";
import ReactCrop, { type Crop, type PercentCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface PartnerLogoEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageFile: File | null;
  onComplete: (blob: Blob) => void;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function getCroppedImg(
  imageSrc: string,
  percentCrop: PercentCrop
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const scaleX = image.naturalWidth / 100;
  const scaleY = image.naturalHeight / 100;
  const srcX = percentCrop.x * scaleX;
  const srcY = percentCrop.y * scaleY;
  const srcW = percentCrop.width * scaleX;
  const srcH = percentCrop.height * scaleY;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(srcW);
  canvas.height = Math.round(srcH);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");
  ctx.drawImage(
    image,
    srcX,
    srcY,
    srcW,
    srcH,
    0,
    0,
    canvas.width,
    canvas.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/png",
      0.95
    );
  });
}

export function PartnerLogoEditor({
  open,
  onOpenChange,
  imageFile,
  onComplete,
}: PartnerLogoEditorProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [completedCrop, setCompletedCrop] = useState<PercentCrop | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const loadImage = useCallback(() => {
    if (!imageFile) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  if (open && imageFile && !imageSrc) {
    loadImage();
  }

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    const initialCrop: PercentCrop = {
      unit: "%",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  }, []);

  const handleApply = useCallback(async () => {
    if (!imageSrc || !completedCrop) return;
    setIsSaving(true);
    try {
      const blob = await getCroppedImg(imageSrc, completedCrop);
      onComplete(blob);
      onOpenChange(false);
      setImageSrc(null);
      setCrop(undefined);
      setCompletedCrop(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [imageSrc, completedCrop, onComplete, onOpenChange]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
    setImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(null);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-[#080B0E] border-border/50 text-foreground [&_button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle>Edit partner logo</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 flex flex-col gap-4">
          {imageSrc && (
            <>
              <p className="text-sm text-muted-foreground">
                Drag corners to resize · Drag inside to move
              </p>
              <div className="relative min-h-[320px] w-full bg-[#171717] rounded-lg overflow-hidden flex items-center justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c, percentCrop) => {
                    setCrop(c);
                    setCompletedCrop(percentCrop);
                  }}
                  onComplete={(_, percentCrop) => setCompletedCrop(percentCrop)}
                  className="max-h-[400px] [&_img]:max-h-[400px] [&_img]:w-auto"
                  keepSelection
                  ruleOfThirds
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop"
                    onLoad={onImageLoad}
                    className="max-h-[400px] w-auto"
                  />
                </ReactCrop>
              </div>
            </>
          )}
        </div>
        <DialogFooter className="shrink-0 gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717]">
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!completedCrop || isSaving} className="cursor-pointer">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
