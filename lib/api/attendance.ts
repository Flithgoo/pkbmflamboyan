"use server";

import { getAuthContext } from "@/lib/getAuthContext";

export async function getActiveSessionByMaterial(materialId: number) {
  const { supabase } = await getAuthContext();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("attendance_sessions")
    .select("*")
    .eq("material_id", materialId)
    .lte("session_start", now)
    .gte("session_end", now);

  if (error) {
    console.error("Error fetching active session:", error);
    return { data: null, error };
  }
  return {
    data: Array.isArray(data) && data.length > 0 ? data[0] : null,
    error: null,
  };
}

export async function getAttendanceForUser(sessionId: number) {
  const { supabase } = await getAuthContext();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id as number | undefined;

  if (!userId) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("attendances")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching attendance:", error);
    return { data: null, error };
  }

  return { data, error: null };
}
