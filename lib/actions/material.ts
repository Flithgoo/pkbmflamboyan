"use server";

import { getAuthContext } from "@/lib/getAuthContext";
import { deleteSubject, editSubject, InsertSubject } from "../api/subject";
import { EditTutorSubject, InsertTutorSubject } from "../api/tutor_subject";
import { Classes } from "../types/types";

export async function addTutorSubjectAction(
  prevState: { success: boolean },
  formData: FormData
) {
  try {
    const name = formData.get("name") as string;
    const tutorId = formData.get("tutor") as unknown as number;
    const description = (formData.get("description") as string) || "";

    const { data: subject, error: subjectError } = await InsertSubject(
      name,
      description
    );

    if (subjectError) {
      const errorMessage =
        typeof subjectError === "string" ? subjectError : subjectError.message;
      throw new Error(`Error inserting subject: ${errorMessage}`);
    }

    if (!subject || !subject[0] || !subject[0].id) {
      throw new Error("Subject data is missing or invalid.");
    }

    const { data: tutor_subject, error: tutorError } = await InsertTutorSubject(
      tutorId,
      subject[0].id
    );
    if (tutorError) {
      const errorMessage =
        typeof tutorError === "string" ? tutorError : tutorError.message;
      throw new Error(`Error inserting tutor subject: ${errorMessage}`);
    }

    console.log(
      "app/lib/actions/subject.ts Subject added successfully:",
      tutor_subject
    );
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

interface Payload {
  jenis_upload: string;
  location_id: number;
  kelas: Omit<Classes, "created_at">[];
  title: string;
  content: string;
  tutor_id: number;
  mapel_id: number;
  is_absensi_enabled?: boolean;
  absensi_start?: string;
  absensi_end?: string;
}

export async function addMaterialAction({
  jenis_upload,
  location_id,
  kelas,
  title,
  content,
  tutor_id,
  mapel_id,
  is_absensi_enabled,
  absensi_start,
  absensi_end,
}: Payload) {
  const { supabase } = await getAuthContext();

  try {
    const { error } = await supabase.rpc("add_material_with_attendance", {
      jenis_upload,
      p_location_id: location_id,
      kelas, // array of object {id, nama}
      title,
      content,
      tutor_id,
      mapel_id,
      is_absensi_enabled,
      absensi_start,
      absensi_end,
    });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("Error addMaterialAction:", err);
    return { success: false };
  }
}
