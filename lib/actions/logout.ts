"use server";

import { logout } from "@/lib/api/user";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await logout();
  redirect("/login"); // arahkan ke halaman login setelah logout
}
