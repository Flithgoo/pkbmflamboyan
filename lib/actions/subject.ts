"use server";

import {
  deleteSubject,
  editSubjectTutorAndClassRelations,
  insertSubjectTutorAndClassRelations,
} from "../api/subject";
import { EditTutorSubject, InsertTutorSubject } from "../api/tutor_subject";

export async function addTutorSubjectAction(
  prevState: { success: boolean },
  formData: FormData,
) {
  try {
    const name = formData.get("name") as string;
    const tutorId = formData.get("tutor") as unknown as number;
    const selectedClasses = formData.get("classes") as string; // Ambil semua nilai "classes" sebagai array string
    const description = (formData.get("description") as string) || "";

    const { data, error } = await insertSubjectTutorAndClassRelations(
      name,
      tutorId,
      JSON.parse(selectedClasses),
      description,
    );

    if (error) {
      const errorMessage = typeof error === "string" ? error : error.message;
      throw new Error(`Error inserting subject: ${errorMessage}`);
    }

    console.log(
      "app/lib/actions/subject.ts Subject added successfully: ",
      data,
    );
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function editSubjectAction(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const tutorId = formData.get("tutor") as unknown as number;
    const selectedClasses = formData.get("classes") as string; // Ambil semua nilai "classes" sebagai array string
    const description = (formData.get("description") as string) || "";

    const { data, error } = await editSubjectTutorAndClassRelations(
      id,
      name,
      tutorId,
      JSON.parse(selectedClasses),
      description,
    );

    if (error) {
      const errorMessage = typeof error === "string" ? error : error.message;
      throw new Error(`Error editing subject: ${errorMessage}`);
    }

    console.log(
      "app/lib/actions/subject.ts Subject edited successfully: ",
      data,
    );
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function deleteSubjectAction(id: number) {
  const { error } = await deleteSubject(id);

  if (error) {
    const errorMessage = typeof error === "string" ? error : error.message;
    return { error: errorMessage };
  }

  console.log(
    `app/lib/actions/subject.ts Subject with id = ${id} deleted successfully`,
  );
  return { success: true };
}
function update_subject_with_tutor_and_classes(
  id: number,
  name: string,
  tutorId: number,
  arg3: any,
  description: string,
): { data: any; error: any } | PromiseLike<{ data: any; error: any }> {
  throw new Error("Function not implemented.");
}
