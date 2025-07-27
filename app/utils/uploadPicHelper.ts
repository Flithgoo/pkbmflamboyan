import { supabase } from "./supabase";

export async function uploadProfilePicture(file: File): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `profile_pictures/${fileName}`;

  const { error } = await supabase.storage
    .from("profile-picture") // nama bucket
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload failed:", error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("profile-picture")
    .getPublicUrl(filePath);
  return publicUrlData?.publicUrl ?? null;
}
