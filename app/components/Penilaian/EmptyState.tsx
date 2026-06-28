"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardX } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="py-16 text-center">
        <ClipboardX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Belum ada tugas.
        </h3>
        <p className="text-gray-600 text-sm mb-6">Tutor belum membuat tugas.</p>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled
        >
          Buat Tugas
        </Button>
      </CardContent>
    </Card>
  );
}
