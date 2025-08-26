"use server";

import { InsertSubject } from "../api/subject";
import { InsertTutorSubject } from "../api/tutor_subject";

export async function addTutorSubjectAction(
  prevState: { success: boolean },
  formData: FormData
) {
  try {
    console.log("🚀 ~ addTutorSubjectAction ~ formData:", formData);
    const name = formData.get("name") as string;
    const tutorId = formData.get("tutor") as string;

    const { data: subject, error: subjectError } = await InsertSubject(name);
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
      "app/lib/actions/user.ts Subject added successfully:",
      tutor_subject
    );
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
