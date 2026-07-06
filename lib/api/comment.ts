"use server";

import { getAuthContext } from "@/lib/getAuthContext";

export async function getMaterialComments(materialId: number) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase.rpc("get_material_comments", {
    p_material_id: materialId,
  });

  if (error) {
    console.error("Error rpc get_material_comments:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function createMaterialComment(
  userId: number,
  materialId: number,
  comment: string,
) {
  const { supabase } = await getAuthContext();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      material_id: materialId,
      user_id: userId,
      comment: comment.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error createMaterialComment:", error);
    return { data: null, error };
  }

  return { data, error: null };
}
