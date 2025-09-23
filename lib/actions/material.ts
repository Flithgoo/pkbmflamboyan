"use server";

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
}

export async function addMaterialAction({
  jenis_upload,
  location_id,
  kelas,
  title,
  content,
  tutor_id,
  mapel_id,
}: Payload) {
  try {
    console.log("Material data to be added:", {
      jenis_upload,
      location_id,
      kelas,
      title,
      content,
      tutor_id,
      mapel_id,
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
