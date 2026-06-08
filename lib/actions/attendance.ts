"use server";

import { getAuthContext } from "@/lib/getAuthContext";
import { studentCheckIn } from "../api/attendance";

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

  if (existingError) {
    console.error("Error checking existing attendance:", existingError);
    return { success: false, error: existingError };
  }

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

export async function studentCheckInAction(
  attendanceId: number,
  status: string,
) {
  try {
    const { data, error } = await studentCheckIn(attendanceId, status);

    if (error) {
      const errorMessage = typeof error === "string" ? error : error.message;
      return { success: false, error: errorMessage };
    }

    console.log(
      "app/lib/actions/attendance.ts Student checked in successfully: ",
      data,
    );
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "An unexpected error occurred" };
  }
}
