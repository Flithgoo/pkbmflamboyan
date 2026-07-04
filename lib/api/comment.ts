import { MaterialComment, CreateCommentPayload } from "@/lib/types/comment";

// Mock data sementara — TODO: ganti dengan query Supabase / RPC sesungguhnya
const MOCK_COMMENTS: MaterialComment[] = [
  {
    id: 1,
    user_name: "Ahmad",
    user_role: "Siswa",
    class_name: "Paket B",
    comment: "Pak saya belum paham materi ini.",
    created_at: "2026-07-04T10:30:00Z",
    is_owner: false,
  },
  {
    id: 2,
    user_name: "Ibu Sari",
    user_role: "Tutor",
    class_name: null,
    comment: "Baik, akan saya jelaskan ulang di pertemuan berikutnya ya.",
    created_at: "2026-07-04T11:05:00Z",
    is_owner: true,
  },
];

/**
 * Placeholder: mengambil daftar komentar untuk sebuah materi.
 * TODO: ganti dengan panggilan Supabase RPC / REST API sesungguhnya.
 */
export async function getMaterialComments(
  materialId: number,
): Promise<{ data: MaterialComment[] | null; error: Error | null }> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { data: MOCK_COMMENTS, error: null };
}

/**
 * Placeholder: membuat komentar baru untuk sebuah materi.
 * TODO: ganti dengan insert ke Supabase / RPC sesungguhnya.
 */
export async function createMaterialComment(
  materialId: number,
  payload: CreateCommentPayload,
): Promise<{ data: MaterialComment | null; error: Error | null }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newComment: MaterialComment = {
    id: Date.now(),
    user_name: "Anda",
    user_role: "Tutor",
    class_name: null,
    comment: payload.comment,
    created_at: new Date().toISOString(),
    is_owner: true,
  };

  return { data: newComment, error: null };
}
