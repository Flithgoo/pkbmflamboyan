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

// Ambil SEMUA materi yang boleh diakses siswa tertentu berdasarkan kelas dan lokasi.
export async function getStudentMaterialsBySubjectId(
  subjectId: number,
  studentId: number,
) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase.rpc("get_student_materials", {
    p_subject_id: subjectId,
    p_user_id: studentId,
  });

  return { data, error };
}

// Ambil SATU materi berdasarkan ID beserta nama mapel dan nama tutor.
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

export async function getStudentWithMaterialDetail(
  studentId: number,
  materialId: number,
) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase.rpc("get_student_material_detail", {
    p_user_id: studentId,
    p_material_id: materialId,
  });

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
