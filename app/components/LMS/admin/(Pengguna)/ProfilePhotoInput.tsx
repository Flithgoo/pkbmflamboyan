"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

type Props = {
  label?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
};

export function ProfilePhotoInput({
  label = "Foto Profil",
  value,
  onChange,
}: Props) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("Ukuran maksimal foto adalah 2 MB.");
      return;
    }

    onChange(file);
  };

  return (
    <div className="grid gap-3">
      <Label>{label}</Label>

      <div
        className={cn(
          "relative flex h-32 cursor-pointer items-center justify-center rounded-md border border-dashed",
          "bg-background text-sm text-muted-foreground hover:bg-muted/40"
        )}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview Foto"
              fill
              className="rounded-md object-cover"
            />

            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-5 w-5" />
            <span>Klik untuk upload foto</span>
            <span className="text-xs text-muted-foreground">
              JPG / PNG, maksimal 2 MB
            </span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          name="profile_picture"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </div>
  );
}
