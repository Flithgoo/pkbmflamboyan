"use server";

import { getAuthContext } from "@/lib/getAuthContext";
import { isAuthorizedAdmin } from "@/lib/isAuthorized";

export async function getAllTutorSubject() {
  const { token, supabase } = await getAuthContext();
  const isAuthorized = await isAuthorizedAdmin(token);

  if (!isAuthorized) {
    return { data: null, error: "Not authorized" };
  }
  const { data, error } = await supabase.from("subjects").select(`
    *,
    tutor_subjects(
      users!user_id(id, name)
    )
  `);
  if (error) {
    console.error("Error fetching subjects:", error);
    return { error };
  }
  return { data, error: null };
}

export async function InsertTutorSubject(user_id: number, subject_id: number) {
  const { token, supabase } = await getAuthContext();
  const isAuthorized = await isAuthorizedAdmin(token);

  if (!isAuthorized) {
    return { data: null, error: "Not authorized" };
  }

  const { data, error } = await supabase
    .from("tutor_subjects")
    .insert([
      {
        user_id,
        subject_id,
      },
    ])
    .select();
  if (error) {
    console.error("Error inserting subject:", error);
    return { error };
  }
  return { data, error: null };
}

export async function EditTutorSubject(user_id: number, subject_id: number) {
  const { token, supabase } = await getAuthContext();
  const isAuthorized = await isAuthorizedAdmin(token);

  if (!isAuthorized) {
    return { data: null, error: "Not authorized" };
  }

  const { data, error } = await supabase
    .from("tutor_subjects")
    .update({
      user_id,
    })
    .eq("subject_id", subject_id) // i want to update based on subject_id
    .select();

  if (error) {
    console.error("Error editing subject:", error);
    return { error };
  }
  return { data, error: null };
}

export async function getTutorSubject(user_id: number) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase
    .from("tutor_subjects")
    .select(`subject:subjects ( id, name, created_at, description )`)
    .eq("user_id", user_id); // ganti dengan id tutor
  if (error) {
    console.error("Error fetching subjects:", error);
    return { error };
  }
  return { data, error: null };
}
