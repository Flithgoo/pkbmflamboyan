import { supabase } from "./supabase";

export async function editProfilePicture(
  file: File,
  oldFilePath?: string // contoh: "profile_pictures/1690831098231.jpg"
): Promise<string | null> {
  // 1. Hapus file lama jika ada
  if (oldFilePath) {
    const { error: deleteError } = await supabase.storage
      .from("profile-picture")
      .remove([oldFilePath]);

    if (deleteError) {
      console.warn("Gagal menghapus gambar lama:", deleteError.message);
      // boleh lanjut, atau return null tergantung preferensimu
    }
  }

  // 2. Upload file baru
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const newFilePath = `profile_pictures/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-picture")
    .upload(newFilePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload gagal:", uploadError.message);
    return null;
  }

  // 3. Ambil URL publik dari gambar baru
  const { data: publicUrlData } = supabase.storage
    .from("profile-picture")
    .getPublicUrl(newFilePath);

  return publicUrlData?.publicUrl ?? null;
}
