import { createSupabaseServerClient } from "@/app/utils/supabase-server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

const getToken = async () => {
  const supabase = createSupabaseServerClient();
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new Error("No token found in cookies");
  }
  return { token, supabase };
};

export async function getUser() {
  const { token, supabase } = await getToken();
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
  const { token, supabase } = await getToken();
  let user = null; // Initialize user as null
  if (token) {
    try {
      user = await verifyJwt(token); // user = { id, email, role }
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  if (!user || user.role !== "admin") {
    return { data: null, error: "Not authorized" };
  }

  const { data, error } = await supabase.from("users").select("*");
  return { data, error };
}

export async function logout() {
  // Hapus cookie token
  cookies().set("token", "", { path: "/", maxAge: 0 });
}
