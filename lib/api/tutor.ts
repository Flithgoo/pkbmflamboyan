"use server";

import { getAuthContext } from "@/lib/getAuthContext";
import { isAuthorizedAdmin } from "@/lib/isAuthorized";

export async function getAllTutor() {
  const { token, supabase } = await getAuthContext();
  const isAuthorized = await isAuthorizedAdmin(token);

  if (!isAuthorized) {
    return { data: null, error: "Not authorized" };
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "tutor");
  return { data, error };
}
