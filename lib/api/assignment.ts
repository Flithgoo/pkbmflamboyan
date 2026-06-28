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

export async function getAssignmentMaterials(tutorId: number) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase.rpc("get_assignment_materials", {
    p_tutor_id: tutorId,
  });

  if (error) {
    console.error("Error rpc get_assignment_materials:", error);
    return { error };
  }
  return { data, error: null };
}

export async function getAssignmentSubmissions(materialId: number) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase.rpc("get_assignment_submissions", {
    p_material_id: materialId,
  });

  if (error) {
    console.error("Error rpc get_assignment_submissions:", error);
    return { error };
  }
  return { data, error };
}
