"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { BookOpen, Users, CheckCircle2, AlertCircle } from "lucide-react";

import { AssignmentMaterial, StatsData } from "@/lib/types/assignment";
import {
  calculateStats,
  filterBySearch,
  filterBySubject,
  sortAssignments,
  getUniqueSubjects,
} from "@/app/utils/assignment";

import { Header } from "@components/Penilaian/Header";
import { StatsCard } from "@components/Penilaian/StatsCard";
import { Toolbar } from "@components/Penilaian/Toolbar";
import { AssignmentGrid } from "@components/Penilaian/AssignmentGrid";
import { LoadingGrid } from "@components/Penilaian/LoadingGrid";

import { getAssignmentMaterials } from "@/lib/api/assignment";
import { useUserStore } from "@/src/store/useUserStore";

export default function PenilaianPage() {
  const { user } = useUserStore();

  const [assignments, setAssignments] = useState<AssignmentMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const fetchAssignments = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      const { data, error } = await getAssignmentMaterials(user.id);

      if (error) {
        console.error("Gagal memuat tugas:", error.message);
        return;
      }

      setAssignments(data ?? []);
    } catch (err) {
      console.error("Fetch assignment error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const subjects = useMemo(() => {
    return getUniqueSubjects(assignments);
  }, [assignments]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...assignments];

    result = filterBySearch(result, searchQuery);
    result = filterBySubject(result, selectedSubject);
    result = sortAssignments(result, sortBy);

    return result;
  }, [assignments, searchQuery, selectedSubject, sortBy]);

  const stats = useMemo<StatsData>(() => {
    return calculateStats(assignments);
  }, [assignments]);

  const handleRefresh = async () => {
    await fetchAssignments();
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedSubject("all");
    setSortBy("latest");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Header onRefresh={handleRefresh} isLoading={isLoading} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-white shadow-sm animate-pulse"
              />
            ))}
          </div>

          <LoadingGrid />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header onRefresh={handleRefresh} isLoading={isLoading} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tugas"
            value={stats.totalAssignments}
            icon={<BookOpen className="h-5 w-5" />}
            color="emerald"
          />

          <StatsCard
            title="Total Siswa"
            value={stats.totalStudents}
            icon={<Users className="h-5 w-5" />}
            color="green"
          />

          <StatsCard
            title="Sudah Dinilai"
            value={stats.gradedCount}
            icon={<CheckCircle2 className="h-5 w-5" />}
            color="emerald"
          />

          <StatsCard
            title="Belum Dinilai"
            value={stats.notGradedCount}
            icon={<AlertCircle className="h-5 w-5" />}
            color="amber"
          />
        </div>

        <Toolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          subjectValue={selectedSubject}
          onSubjectChange={setSelectedSubject}
          sortValue={sortBy}
          onSortChange={setSortBy}
          onReset={handleReset}
          subjects={subjects}
        />

        <AssignmentGrid assignments={filteredAndSortedData} />
      </div>
    </div>
  );
}
