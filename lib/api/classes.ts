"use server";

import { getAuthContext } from "@/lib/getAuthContext";
import { isAuthorizedAdmin } from "@/lib/isAuthorized";

export async function getAllClasses() {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase.from("classes").select("id, name");
  return { data, error };
}
