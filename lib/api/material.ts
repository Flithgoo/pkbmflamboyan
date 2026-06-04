"use server";

import { getAuthContext } from "@/lib/getAuthContext";

export async function getMaterialBySubjectId(subjectId: number) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase
    .from("materials")
    .select()
    .eq("subject_id", subjectId);

  return { data, error };
}

export async function getMaterialById(id: number) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

export async function getMaterialWithRelations(id: number) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase
    .from("materials")
    .select(
      `
      id,
      title,
      content,
      created_at,
      file_url,
      subject_id,
      user_id,
      subjects(id, name),
      users(id, name)
    `,
    )
    .eq("id", id)
    .single();

  return { data, error };
}

export async function updateMaterial(
  id: number,
  updates: { title?: string; content?: string },
) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase
    .from("materials")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

export async function deleteMaterial(id: number) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase
    .from("materials")
    .delete()
    .eq("id", id);

  return { data, error };
}
