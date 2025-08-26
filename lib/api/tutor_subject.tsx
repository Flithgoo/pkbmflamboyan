"use server";

import { getAuthContext } from "@/lib/getAuthContext";
import { isAuthorizedAdmin } from "@/lib/isAuthorized";

export async function InsertTutorSubject(user_id: string, subject_id: string) {
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
