"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

interface ToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  subjectValue: string;
  onSubjectChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
  subjects: string[];
}

export function Toolbar({
  searchValue,
  onSearchChange,
  subjectValue,
  onSubjectChange,
  sortValue,
  onSortChange,
  onReset,
  subjects,
}: ToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      {/* Search */}
      <div className="w-full sm:w-64 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Cari judul tugas..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3 w-full sm:w-auto">
        <Select value={subjectValue} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-full sm:w-40 bg-gray-50 border-gray-200">
            <SelectValue placeholder="Semua Mapel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mapel</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-40 bg-gray-50 border-gray-200">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Terbaru</SelectItem>
            <SelectItem value="oldest">Terlama</SelectItem>
            <SelectItem value="progress_high">Progress Tertinggi</SelectItem>
            <SelectItem value="progress_low">Progress Terendah</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="border-gray-200 hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
