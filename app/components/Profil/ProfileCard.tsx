// @components/Profil/ProfileCard.tsx
"use client";

import { GraduationCap, MapPin, Camera } from "lucide-react";
import { getUserClassAndLocation, updateProfilePicture } from "@/lib/api/user";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/lib/types/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateProfilePictureAction } from "@/lib/actions/user";

interface ProfileCardProps {
  user: UserProfile;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const roleLabel: Record<UserProfile["role"], string> = {
  pelajar: "Pelajar",
  tutor: "Tutor",
};

export function ProfileCard({ user }: ProfileCardProps) {
  const [preview, setPreview] = useState(user.profile_picture);
  const [uploading, setUploading] = useState(false);
  const [userClass, setUserClass] = useState<string | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<string | undefined>(
    undefined,
  );
  const isPelajar = user.role === "pelajar";

  useEffect(() => {
    async function initialFetch() {
      try {
        const { class: cls, location } = await getUserClassAndLocation(user.id);
        setUserClass(cls?.name);
        setUserLocation(location?.name);
      } catch (err) {
        console.error(err);
      }
    }

    if (isPelajar) {
      initialFetch();
    }
  }, [isPelajar, user.id]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image")) {
      toast.error("File harus berupa gambar");
      return;
    }

    console.log("🚀 ~ handleUpload ~ file:", file);
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran maksimal 2MB");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("userId", String(user.id));
      formData.append("newPicture", file);
      formData.append("oldPicture", user.profile_picture ?? "");

      const url = await updateProfilePictureAction(formData);

      setPreview(url);

      toast.success("Foto profil berhasil diperbarui");
    } catch (error) {
      console.error(error);

      toast.error("Gagal mengubah foto profil");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="w-full rounded-xl shadow-sm border-emerald-100">
      <CardHeader>
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-emerald-100">
              <AvatarImage src={preview} alt={user.name} />

              <AvatarFallback className="bg-emerald-50 text-emerald-700 text-lg font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <label
              htmlFor="profile-upload"
              className="
      absolute bottom-0 right-0
      flex h-7 w-7 cursor-pointer
      items-center justify-center
      rounded-full
      bg-emerald-600
      text-white
      shadow
      hover:bg-emerald-700
    "
            >
              <Camera className="h-4 w-4" />

              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-base font-semibold text-foreground">
              {user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              username : {user.username}
            </p>
            <Badge
              variant="outline"
              className={`mt-1 rounded-full ${isPelajar ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"} `}
            >
              {roleLabel[user.role]}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isPelajar && (userClass || userLocation) && (
          <div className="mt-3 grid grid-cols-1 gap-3 border-t pt-7 sm:grid-cols-2">
            {userClass && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
                <GraduationCap className="h-4 w-4 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Kelas</p>
                  <p className="text-sm font-medium text-foreground">
                    {userClass}
                  </p>
                </div>
              </div>
            )}

            {userLocation && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
                <MapPin className="h-4 w-4 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Lokasi</p>
                  <p className="text-sm font-medium text-foreground">
                    {userLocation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
