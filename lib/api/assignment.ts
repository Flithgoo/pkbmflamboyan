"use server";

import { getAuthContext } from "@/lib/getAuthContext";

export async function submitAssignment(
  materialId: number,
  studentId: number,
  answer: string,
) {
  const { supabase } = await getAuthContext();

  return await supabase.from("assignment_submissions").upsert(
    {
      material_id: materialId,
      student_id: studentId,
      answer,
      submitted_at: new Date().toISOString(),
    },
    {
      onConflict: "material_id,student_id",
    },
  );
}
