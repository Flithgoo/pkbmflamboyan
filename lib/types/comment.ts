export type CommentUserRole = "admin" | "tutor" | "pelajar";

export interface MaterialComment {
  id: number;
  user_name: string;
  user_role: CommentUserRole;
  class_name?: string | null;
  profile_picture: string | null;
  comment: string;
  created_at: string;
  is_owner: boolean;
}

export interface CreateCommentPayload {
  comment: string;
  // Sementara dikirim dari client karena belum ada backend/session.
  // Nanti kalau backend sudah ada, field ini bisa dihapus—role & nama
  // akan diambil dari session user di server.
  user_name?: string;
  user_role?: CommentUserRole;
  class_name?: string | null;
}
