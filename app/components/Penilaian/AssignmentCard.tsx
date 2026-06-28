"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AssignmentMaterial } from "@/lib/types/assignment";
import { getProgressLabel, formatDateShort } from "@/app/utils/assignment";

interface AssignmentCardProps {
  assignment: AssignmentMaterial;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const {
    material_id,
    subject_id,
    title,
    subject_name,
    created_at,
    total_students,
    total_submitted,
    total_not_submitted,
    progress,
  } = assignment;

  return (
    <Card className="border-0 flex flex-col justify-between shadow-md hover:shadow-lg hover:-translate-y-1 transition-all bg-white overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap items-center">
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-700 border-0"
            >
              Tugas
            </Badge>
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 text-amber-700"
            >
              {subject_name}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Dibuat pada {formatDateShort(created_at)}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="py-4 space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Progres Pengumpulan
            </span>
            <span className={`text-lg font-bold ${getProgressLabel(progress)}`}>
              {progress.toFixed(1)}%
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-gray-200" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="bg-gray-50 p-2 rounded-lg text-center">
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-bold text-gray-900">{total_students}</p>
          </div>
          <div className="bg-green-50 p-2 rounded-lg text-center">
            <p className="text-xs text-gray-500">Submit</p>
            <p className="font-bold text-green-600">{total_submitted}</p>
          </div>
          <div className="bg-amber-50 p-2 rounded-lg text-center">
            <p className="text-xs text-gray-500">Belum</p>
            <p className="font-bold text-amber-600">{total_not_submitted}</p>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
        <Link
          href={`/LMS/tutor/Mapel/${subject_id}/Materi/${material_id}`}
          className="flex-1"
        >
          <Button
            variant="outline"
            className="flex-1 border-gray-300 hover:bg-gray-50"
            size="sm"
          >
            Lihat Materi
          </Button>
        </Link>
        <Link href={`/LMS/tutor/Penilaian/${material_id}`} className="flex-1">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            size="sm"
          >
            Kelola Penilaian
          </Button>
        </Link>
      </div>
    </Card>
  );
}
