"use server";

import bcrypt from "bcryptjs";
import {
  insertUser,
  editUser,
  deleteUser,
  updateProfilePicture,
} from "@/lib/api/user";
import { redirect } from "next/navigation";
import { uploadProfilePicture } from "@/app/utils/uploadPicHelper";
import { uploadOrReplaceProfilePicture } from "../services/profile-picture";

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
  redirect("/LMS/admin/Pengguna"); // redirect jika berhasil
}

export async function editUserAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const studentClass = formData.get("studentClass") as string;
  const location = formData.get("location") as string;

  const file = formData.get("profile_picture");
  const currentProfilePicture = formData.get("current_profile_picture") as
    | string
    | null;
  // 1. Password
  const hashedPassword =
    password && password !== "" ? await bcrypt.hash(password, 10) : null;

  // 2. Foto profil
  let profilePictureUrl = currentProfilePicture;

  if (file instanceof File && file.size > 0) {
    profilePictureUrl = await uploadOrReplaceProfilePicture(
      file,
      currentProfilePicture,
    );
  }

  // 3. Update user
  const { error } = await editUser(
    id,
    name,
    username,
    hashedPassword,
    role,
    profilePictureUrl,
    studentClass ? Number(studentClass) : null,
    location ? Number(location) : null,
  );

  if (error) {
    throw new Error(typeof error === "string" ? error : error.message);
  }

  redirect("/LMS/admin/Pengguna");
}

export async function deleteUserAction(id: number) {
  const { error } = await deleteUser(id);
  if (error)
    return { error: typeof error === "string" ? error : error.message };

  console.log(
    `app/lib/actions/user.ts User with id = ${id} deleted successfully`,
  );
  return { success: true };
}

export async function updateProfilePictureAction(formData: FormData) {
  const newPicture = formData.get("newPicture") as File;
  const oldPicture = formData.get("oldPicture") as string;
  console.log("🚀 ~ updateProfilePictureAction ~ oldPicture:", oldPicture);

  const userId = Number(formData.get("userId"));

  if (!newPicture) {
    throw new Error("File tidak ditemukan");
  }

  return await updateProfilePicture(userId, newPicture, oldPicture || null);
}
