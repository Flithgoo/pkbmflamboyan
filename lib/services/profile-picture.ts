import { editProfilePicture } from "@/app/utils/editPicHelper";

export async function uploadOrReplaceProfilePicture(
  file: File,
  currentUrl: string | null,
): Promise<string> {
  let oldPath: string | undefined = undefined;

  if (currentUrl) {
    const match = currentUrl.match(/\/profile-picture\/(.+)$/);
    oldPath = match ? match[1] : undefined;
  }

  // upload & replace
  const publicUrl = await editProfilePicture(file, oldPath);

  return publicUrl ?? "";
}
