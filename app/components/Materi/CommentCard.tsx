"use client";

import React from "react";
import { MaterialComment } from "@/lib/types/comment";
import { getInitials, formatCommentTime } from "@/app/utils/comment";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentCardProps {
  comment: MaterialComment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const isTutor = comment.user_role === "tutor";

  return (
    <div
      className={`flex gap-3 p-4 rounded-xl border transition-colors ${
        comment.is_owner
          ? "bg-emerald-50/60 border-emerald-200"
          : "bg-white border-gray-100 hover:border-emerald-100"
      }`}
    >
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage
          src={comment.profile_picture ?? undefined}
          alt={comment.user_name}
        />
        <AvatarFallback
          className={`font-semibold text-sm ${
            isTutor
              ? "bg-amber-400 text-white"
              : comment.user_role === "admin"
                ? "bg-slate-100 text-slate-700"
                : "bg-emerald-500 text-white"
          }`}
        >
          {getInitials(comment.user_name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-semibold text-gray-800 text-sm">
            {comment.user_name}
          </span>

          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              isTutor
                ? "bg-amber-100 text-amber-700"
                : comment.user_role === "admin"
                  ? "bg-slate-100 text-slate-700"
                  : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {comment.user_role}
          </span>

          {comment.class_name && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {comment.class_name}
            </span>
          )}

          <span className="ml-auto text-[11px] text-gray-400">
            {formatCommentTime(comment.created_at)}
          </span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
          {comment.comment}
        </p>
      </div>
    </div>
  );
}
