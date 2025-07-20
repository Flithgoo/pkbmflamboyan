"use server";

import bcrypt from "bcryptjs";
import { insertUser, editUser, deleteUser } from "@/lib/api/user";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function addUserAction(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const profile_picture = formData.get("profile_picture") as string | null;

  // Hash password di sini
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await insertUser(
    name,
    username,
    hashedPassword,
    role,
    profile_picture
  );
  if (error) {
    throw new Error(`Error inserting user: ${error.message}`);
  }

  console.log("app/lib/actions/user.ts User added successfully:", data);
  redirect("/LMS/admin"); // redirect jika berhasil
}

export async function editUserAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const profile_picture = formData.get("profile_picture") as string | null;

  // Hash password di sini
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await editUser(
    id,
    name,
    username,
    hashedPassword,
    role,
    profile_picture
  );
  if (error) {
    throw new Error(`Error editing user: ${error.message}`);
  }

  console.log("app/lib/actions/user.ts User edited successfully:", data);
  redirect("/LMS/admin"); // redirect jika berhasil
}

export async function deleteUserAction(id: string) {
  const { error } = await deleteUser(id);
  if (error) return { error: error.message };

  console.log(
    `app/lib/actions/user.ts User with id = ${id} deleted successfully`
  );
  return { success: true };
}
