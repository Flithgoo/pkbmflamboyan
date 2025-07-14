"use server";

import { insertUser } from "@/lib/api/user";
import { Console } from "console";
import { redirect } from "next/navigation";

export async function addUserAction(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const profile_picture = formData.get("profile_picture") as string | null;

  const { data, error } = await insertUser(
    name,
    username,
    password,
    role,
    profile_picture
  );
  if (error) return { error: error.message };

  console.log("app/lib/actions/user.ts User added successfully:", data);
  redirect("/LMS/admin"); // redirect jika berhasil
}
