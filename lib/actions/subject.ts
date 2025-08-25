"use server";

import bcrypt from "bcryptjs";
import { insertUser, editUser, deleteUser } from "@/lib/api/user";
import { redirect } from "next/navigation";
import { uploadProfilePicture } from "@/app/utils/uploadPicHelper";

export async function addSubjectAction(formData: FormData) {
  console.log("🚀 ~ addSubjectAction ~ formData:", formData);
  const name = formData.get("name") as string;
  const tutor = formData.get("tutor") as string;

  let profilePictureUrl: string | null = null;
  // if (file) {
  //   profilePictureUrl = await uploadProfilePicture(file);
  // }

  // const { data, error } = await insertUser(
  //   name,
  //   username,
  //   hashedPassword,
  //   role,
  //   profilePictureUrl
  // );
  // if (error) {
  //   throw new Error(`Error inserting user: ${error.message}`);
  // }

  console.log("app/lib/actions/user.ts User added successfully:");
}
