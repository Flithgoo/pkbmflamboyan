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
