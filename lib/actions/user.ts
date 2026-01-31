"use server";

import bcrypt from "bcryptjs";
import { insertUser, editUser, deleteUser } from "@/lib/api/user";
import { redirect } from "next/navigation";
import { uploadProfilePicture } from "@/app/utils/uploadPicHelper";
import { editProfilePicture } from "@/app/utils/editPicHelper";

export async function addUserAction(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const studentClass = formData.get("studentClass") as string;
  const location = formData.get("location") as string;
  const file = formData.get("profile_picture") as File | null;

  // Hash password di sini
  const hashedPassword = await bcrypt.hash(password, 10);

  let profilePictureUrl: string | null = null;
  if (file) {
    profilePictureUrl = await uploadProfilePicture(file);
  }

  const { data, error } = await insertUser(
    name,
    username,
    hashedPassword,
    role,
    profilePictureUrl,
    studentClass ? Number(studentClass) : null,
    location ? Number(location) : null,
  );
  if (error) {
    throw new Error(`Error inserting user: ${error.message}`);
  }

  console.log("app/lib/actions/user.ts User added successfully:", data);
  redirect("/LMS/admin"); // redirect jika berhasil
}

export async function editUserAction(formData: FormData) {
  const id = formData.get("id") as unknown as number;
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const file = formData.get("profile_picture") as File | null;
  const currentFile = formData.get("current_profile_picture") as string;

  let profilePicturePath: string = "";
  let profilePictureUrl: string | null = null;

  let hashedPassword = null;
  // Hash password di sini
  if (password !== "") {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  if (file) {
    try {
      // Jika profile_picture sudah berupa path (bukan URL), gunakan langsung
      if (!currentFile.startsWith("http")) {
        profilePicturePath = currentFile;
      } else {
        // Jika currentFile berupa URL, ambil path setelah domain bucket
        // Contoh: https://xxxx.supabase.co/storage/v1/object/public/profile-picture/folder/file.jpg
        // Ambil bagian setelah "/profile-picture/"
        const match = currentFile.match(/\/profile-picture\/(.+)$/);
        profilePicturePath = match ? match[1] : "";
      }
    } catch (e) {
      console.error("Gagal mendapatkan path dari profile_picture:", e);
      profilePicturePath = "";
    }

    profilePictureUrl = await editProfilePicture(file, profilePicturePath);
  }

  if (!file || !(file instanceof File) || file.size === 0) {
    // Tidak ada file yang diunggah
    profilePictureUrl = currentFile; // Gunakan foto profil saat ini
  }

  const { data, error } = await editUser(
    id,
    name,
    username,
    hashedPassword,
    role,
    profilePictureUrl,
  );
  if (error) {
    throw new Error(`Error editing user: ${error.message}`);
  }

  console.log("app/lib/actions/user.ts User edited successfully:", data);
  redirect("/LMS/admin"); // redirect jika berhasil
}

export async function deleteUserAction(id: number) {
  const { error } = await deleteUser(id);
  if (error) return { error: error.message };

  console.log(
    `app/lib/actions/user.ts User with id = ${id} deleted successfully`,
  );
  return { success: true };
}
