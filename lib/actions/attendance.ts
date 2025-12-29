"use server";

import { getAuthContext } from "@/lib/getAuthContext";

export async function markAttendanceAction(sessionId: number) {
  const { supabase } = await getAuthContext();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id as number | undefined;

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  // Cek apakah sudah absen
  const { data: existing, error: existingError } = await supabase
    .from("attendances")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", userId);

  if (existing && existing.length > 0) {
    return { success: false, error: "Sudah melakukan absensi" };
  }

  const { data, error } = await supabase
    .from("attendances")
    .insert({ session_id: sessionId, user_id: userId, status: "present" })
    .select();

  if (error) {
    console.error("Error inserting attendance:", error);
    return { success: false, error };
  }

  return { success: true, data };
}
