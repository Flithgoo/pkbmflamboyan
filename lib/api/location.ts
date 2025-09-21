"use server";

import { getAuthContext } from "@/lib/getAuthContext";
import { isAuthorizedAdmin } from "@/lib/isAuthorized";

export async function getAllLocation() {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase.from("location").select("id, name");
  return { data, error };
}
