"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { MaterialComment } from "@/lib/types/comment";
import { getMaterialComments, createMaterialComment } from "@/lib/api/comment";
import CommentCard from "./CommentCard";
import { CommentSkeletonList } from "./CommentSkeleton";
import CommentInput from "./CommentInput";
import { useUserStore } from "@/src/store/useUserStore";

interface CommentSectionProps {
  materialId: number;
}

export default function CommentSection({ materialId }: CommentSectionProps) {
  const [comments, setComments] = useState<MaterialComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUserStore();

  useEffect(() => {
    let isMounted = true;

    const fetchComments = async () => {
      setIsLoading(true);
      setError("");

      try {
        const { data, error: fetchError } =
          await getMaterialComments(materialId);
        if (!isMounted) return;

        if (fetchError) {
          setError("Gagal memuat komentar: " + fetchError.message);
          return;
        }

        const normalizedComments = (data ?? []).map((comment) => ({
          ...comment,
          is_owner: user?.id === comment.user_id,
          user_role: comment.user_role as any,
        }));

        setComments(normalizedComments as MaterialComment[]);
      } catch (err) {
        if (!isMounted) return;
        setError(
          "Terjadi kesalahan saat memuat komentar: " +
            (err instanceof Error ? err.message : "Unknown error"),
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchComments();
    return () => {
      isMounted = false;
    };
  }, [materialId, user?.id]);

  const handleAddComment = useCallback(
    async (text: string) => {
      if (!user?.id) {
        toast.error("Anda harus login untuk menambah komentar");
        return;
      }

      setIsSubmitting(true);

      try {
        const { data, error: createError } = await createMaterialComment(
          user.id,
          materialId,
          text,
        );

        if (createError) {
          toast.error("Gagal mengirim komentar", {
            description: createError.message,
          });
          return;
        }

        if (data) {
          const newComment = {
            ...data,
            comment: data.comment ?? "",
            user_name: user?.name ?? "Anda",
            user_role: (user?.role ?? "siswa") as any,
            profile_picture: user?.profile_picture ?? "",
            is_owner: true,
          } as MaterialComment;

          setComments((prev) => [...prev, newComment]);
        }

        toast.success("Komentar terkirim");
      } catch (err) {
        toast.error("Gagal mengirim komentar", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [materialId, user?.id, user?.name, user?.profile_picture, user?.role],
  );

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden mt-8">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-white" />
        <h2 className="text-white text-lg font-bold">
          Komentar{" "}
          <span className="text-emerald-100 font-medium">
            ({comments.length})
          </span>
        </h2>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {isLoading ? (
          <CommentSkeletonList count={3} />
        ) : comments.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare className="w-10 h-10 text-emerald-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              Belum ada komentar
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Jadilah yang pertama menulis komentar pada materi ini.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}

        <CommentInput onSubmit={handleAddComment} isSubmitting={isSubmitting} />
      </div>
    </section>
  );
}
