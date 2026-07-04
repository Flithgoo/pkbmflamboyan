"use client";

import React, { useState, useCallback } from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CommentInputProps {
  onSubmit: (comment: string) => Promise<void> | void;
  isSubmitting?: boolean;
}

export default function CommentInput({
  onSubmit,
  isSubmitting = false,
}: CommentInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed || isSubmitting) return;

    await onSubmit(trimmed);
    setValue("");
  }, [value, isSubmitting, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end border-t border-gray-100 pt-4">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tulis komentar atau pertanyaan..."
        disabled={isSubmitting}
        className="min-h-[44px] max-h-40 resize-none flex-1 border-emerald-200 focus-visible:ring-emerald-400"
      />

      <Button
        onClick={handleSubmit}
        disabled={!value.trim() || isSubmitting}
        className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shrink-0 w-full sm:w-auto"
      >
        {isSubmitting ? (
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        Kirim
      </Button>
    </div>
  );
}
