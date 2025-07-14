"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { supabase } from "@utils/supabase";
import { signJwt } from "@/lib/jwt";

export async function authTutor(_: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const { data: user, error } = await supabase
    .from("users")
    .select("id, username, password, name, role")
    .eq("username", username)
    .single();

  if (error || !user) return "Username tidak ditemukan";

  const match = await bcrypt.compare(password, user.password);
  if (!match) return "Password salah";

  if (user.role !== "tutor") {
    return "Anda bukan tutor!";
  }

  const token = await signJwt({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  });

  cookies().set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 3, // 3 hari
  });

  redirect("/LMS/tutor");
}
