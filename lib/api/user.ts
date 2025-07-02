import { createSupabaseServerClient } from "@/app/utils/supabase-server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

const supabase = createSupabaseServerClient();

export async function getUser() {
  const token = cookies().get("token")?.value;

  let user = null; // Initialize user as null
  if (token) {
    try {
      user = await verifyJwt(token); // user = { id, email, role }
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  const { data, error } = await supabase
    .from("users")
    .select("profile_picture, name, role")
    .eq("id", user?.id)
    .single();

  return { data, error };
}

export async function getAllUser() {
  const token = cookies().get("token")?.value;

  let user = null; // Initialize user as null
  if (token) {
    try {
      user = await verifyJwt(token); // user = { id, email, role }
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  if (!user) {
    return { data: null, error: "User not authenticated" };
  }

  const { data, error } = await supabase.from("users").select("*");
  return { data, error };
}

export async function logout() {
  // Hapus cookie token
  cookies().set("token", "", { path: "/", maxAge: 0 });
}
