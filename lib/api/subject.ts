"use server";

import { getAuthContext } from "@/lib/getAuthContext";
import { isAuthorizedAdmin } from "@/lib/isAuthorized";

export async function getAllSubject() {
  const { token, supabase } = await getAuthContext();
  const isAuthorized = await isAuthorizedAdmin(token);

  const { data, error } = await supabase.from("subjects").select("*");
  return { data, error };
}

export async function getSubjectById(id: number) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

export async function InsertSubject(name: string, description: string) {
  const { token, supabase } = await getAuthContext();
  const isAuthorized = await isAuthorizedAdmin(token);

  if (!isAuthorized) {
    return { data: null, error: "Not authorized" };
  }

  const { data, error } = await supabase
    .from("subjects")
    .insert({
      name,
      description,
    })
    .select();

  if (error) {
    console.error("Error inserting subject:", error);
    return { error };
  }
  return { data, error: null };
}

export async function editSubject(
  id: number,
  name: string,
  description: string
) {
  const { token, supabase } = await getAuthContext();
  const isAuthorized = await isAuthorizedAdmin(token);

  if (!isAuthorized) {
    return { data: null, error: "Not authorized" };
  }

  const { data, error } = await supabase
    .from("subjects")
    .update({
      name,
      description,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error editing subject:", error);
    return { error };
  }
  return { data, error: null };
}

export async function deleteSubject(id: number) {
  const { token, supabase } = await getAuthContext();
  const isAuthorized = await isAuthorizedAdmin(token);

  if (!isAuthorized) {
    return { data: null, error: "Not authorized" };
  }

  const { data, error } = await supabase
    .from("subjects")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error deleting subject:", error);
    return { error };
  }
  return { data, error: null };
}
