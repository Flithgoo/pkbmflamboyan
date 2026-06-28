"use client";

import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotebookPen, RefreshCw, Loader2 } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  isLoading?: boolean;
}

export function Header({ onRefresh, isLoading = false }: HeaderProps) {
  return (
    <Card className="border-0 shadow-md bg-white overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-600 rounded-lg">
                <NotebookPen className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-emerald-900">
                  Penilaian Tugas
                </CardTitle>
                <CardDescription className="text-base text-emerald-700">
                  Kelola seluruh tugas peserta didik, pantau progres
                  pengumpulan, dan lakukan penilaian.
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-emerald-200 hover:bg-emerald-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              ) : (
                <RefreshCw className="h-5 w-5 text-emerald-600" />
              )}
            </Button>
          </div>
        </CardHeader>
      </div>
    </Card>
  );
}
