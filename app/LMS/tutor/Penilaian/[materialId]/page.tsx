"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
  Search,
  RefreshCw,
  Eye,
  Loader2,
  AlertCircle,
  ChevronRight,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { getAssignmentSubmissions } from "@/lib/api/assignment";
import { getMaterialById } from "@/lib/api/material";
import { Material } from "@/lib/types/types";
import DOMPurify from "isomorphic-dompurify";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

type SubmissionStatus = "belum_mengumpulkan" | "sudah_mengumpulkan";
type FilterStatusValue =
  | "all"
  | "submitted"
  | "not_submitted"
  | "graded"
  | "not_graded";

interface StudentDisplayData {
  submission_id: number | null;
  student_id: number;
  nis: string;
  name: string;
  className: string;
  answer: string | null;
  grade: number | null;
  feedback: string | null;
  submittedAt: string | null;
  status: SubmissionStatus;
  isGraded: boolean;
}

interface Statistics {
  total: number;
  submitted: number;
  notSubmitted: number;
  graded: number;
  notGraded: number;
  averageGrade: number;
}

// ============================================================
// MOBILE CARD COMPONENT
// ============================================================

interface StudentCardProps {
  student: StudentDisplayData;
  index: number;
  onOpenDialog: (student: StudentDisplayData) => void;
}

function StudentCard({
  student,
  index,
  onOpenDialog,
}: StudentCardProps): React.ReactElement {
  const getStatusBadge = (
    status: SubmissionStatus,
    isGraded: boolean,
  ): React.ReactElement => {
    if (status === "belum_mengumpulkan") {
      return (
        <Badge className="bg-red-50 text-red-700 border border-red-200">
          Belum Mengumpulkan
        </Badge>
      );
    }
    if (isGraded) {
      return (
        <Badge className="bg-emerald-600 text-white">
          Dinilai: {student.grade}
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
        Belum Dinilai
      </Badge>
    );
  };

  return (
    <Card className="border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all bg-white">
      <CardContent className="p-3">
        <div className="space-y-3">
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                  {index}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {student.name}
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                NIS {student.nis}
              </p>
            </div>
            <div className="text-right">
              {student.status === "belum_mengumpulkan" ? (
                <p className="text-lg font-bold text-gray-300">-</p>
              ) : (
                <p className="text-2xl font-bold text-emerald-600">
                  {student.grade ?? "-"}
                </p>
              )}
            </div>
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between text-xs bg-gray-50 rounded-lg p-2">
            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{student.className}</span>
            </div>
            {student.submittedAt && (
              <span className="text-gray-500">{student.submittedAt}</span>
            )}
          </div>

          {/* Status Badge */}
          <div className="pt-1">
            {getStatusBadge(student.status, student.isGraded)}
          </div>

          {/* Action Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenDialog(student)}
            className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 text-sm h-9"
          >
            <Eye className="w-3.5 h-3.5 mr-2" />
            Lihat Detail & Nilai
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// SKELETON CARD
// ============================================================

function SkeletonCard(): React.ReactElement {
  return (
    <Card className="border border-gray-200 bg-white">
      <CardContent className="p-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

interface PenilaianPageProps {
  params: { materialId: string };
}

export default function PenilaianPage({
  params,
}: PenilaianPageProps): React.ReactElement {
  const materialId = Number(params.materialId);
  const router = useRouter();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [submissions, setSubmissions] = useState<StudentDisplayData[]>([]);
  const [material, setMaterial] = useState<Material | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatusValue>("all");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentDisplayData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");

  // Fetch submissions from RPC
  const fetchSubmissions = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const { data: materialData, error: materialError } =
        await getMaterialById(materialId);
      const { data, error } = await getAssignmentSubmissions(materialId);

      if (error) {
        throw new Error(error.message || "Gagal memuat data");
      }

      if (!Array.isArray(data)) {
        throw new Error("Format data tidak valid dari server");
      }

      // Transform RPC data to display format
      const transformedData: StudentDisplayData[] = data.map((item: any) => ({
        submission_id: item.submission_id,
        student_id: item.student_id,
        nis: item.student_nis,
        name: item.student_name,
        className: item.class_name,
        answer: item.answer,
        grade: item.score ? Number(item.score) : null,
        feedback: item.feedback,
        submittedAt: item.submitted_at
          ? new Date(item.submitted_at).toLocaleString("id-ID")
          : null,
        status: item.submission_status,
        isGraded: item.score !== null,
      }));

      setMaterial(materialData);
      setSubmissions(transformedData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat data";
      setError(errorMessage);
      console.error("Error fetching submissions:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [materialId]);

  // Initial fetch
  useEffect(() => {
    fetchSubmissions();
  }, [materialId, fetchSubmissions]);

  // Handle refresh
  const handleRefresh = useCallback((): void => {
    setIsRefreshing(true);
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Calculate statistics
  const statistics = useMemo((): Statistics => {
    const total = submissions.length;
    const submitted = submissions.filter(
      (s) => s.status === "sudah_mengumpulkan",
    ).length;
    const notSubmitted = total - submitted;
    const graded = submissions.filter((s) => s.isGraded).length;
    const notGraded = submitted - graded;

    const averageGrade =
      graded > 0
        ? Math.round(
            (submissions
              .filter((s) => s.grade !== null)
              .reduce((sum, s) => sum + (s.grade ?? 0), 0) /
              graded) *
              10,
          ) / 10
        : 0;

    return {
      total,
      submitted,
      notSubmitted,
      graded,
      notGraded,
      averageGrade,
    };
  }, [submissions]);

  // Filter and search logic
  const filteredData = useMemo((): StudentDisplayData[] => {
    return submissions.filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nis.includes(searchQuery);

      let matchFilter = true;
      switch (filterStatus) {
        case "submitted":
          matchFilter = student.status === "sudah_mengumpulkan";
          break;
        case "not_submitted":
          matchFilter = student.status === "belum_mengumpulkan";
          break;
        case "graded":
          matchFilter = student.isGraded;
          break;
        case "not_graded":
          matchFilter =
            student.status === "sudah_mengumpulkan" && !student.isGraded;
          break;
        case "all":
        default:
          matchFilter = true;
      }

      return matchSearch && matchFilter;
    });
  }, [submissions, searchQuery, filterStatus]);

  // Dialog handlers
  const handleOpenDialog = useCallback((student: StudentDisplayData): void => {
    setSelectedStudent(student);
    setGradeInput(student.grade?.toString() ?? "");
    setFeedbackInput(student.feedback ?? "");
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback((): void => {
    setIsDialogOpen(false);
    setSelectedStudent(null);
    setGradeInput("");
    setFeedbackInput("");
  }, []);

  const handleSaveGrade = useCallback((): void => {
    if (!selectedStudent) return;

    console.log("Save grade:", {
      studentId: selectedStudent.student_id,
      submissionId: selectedStudent.submission_id,
      grade: gradeInput ? Number(gradeInput) : null,
      feedback: feedbackInput,
    });

    // TODO: Implement API call to save grade
    handleCloseDialog();
  }, [selectedStudent, gradeInput, feedbackInput, handleCloseDialog]);

  // Get status badge for dialog
  const getStatusBadge = (
    status: SubmissionStatus,
    isGraded: boolean,
  ): React.ReactElement => {
    if (status === "belum_mengumpulkan") {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Belum Mengumpulkan
        </Badge>
      );
    }
    if (isGraded) {
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Sudah Dinilai
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200"
      >
        Belum Dinilai
      </Badge>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header skeleton */}
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="pb-4">
              <Skeleton className="h-8 w-80 mb-2" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
          </Card>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-2">
                  <Skeleton className="h-3 w-20 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12 mb-2" />
                  <Skeleton className="h-2 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Toolbar skeleton */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-9 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-10" />
              </div>
            </CardContent>
          </Card>

          {/* Content skeleton */}
          <div className="md:hidden space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Gagal Memuat Data
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{error}</p>
                </div>
                <Button
                  onClick={handleRefresh}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Coba Lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* ============ HEADER ============ */}
        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <div className="border-b border-emerald-100">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="space-y-3">
                <div>
                  <CardTitle className=" flex justify-between text-xl sm:text-2xl md:text-3xl font-bold text-emerald-900">
                    <span>{material ? material.title : "Penilaian Tugas"}</span>
                    <button
                      onClick={() => router.back()}
                      className="text-sm flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold shadow transition"
                    >
                      <ArrowLeft size={20} />
                      Kembali
                    </button>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-emerald-700 mt-1">
                    Kelola dan nilai tugas siswa
                  </CardDescription>
                </div>

                {/* Progress Bar */}
                {statistics.submitted > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600">
                        Progres Penilaian
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {statistics.graded}/{statistics.submitted}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-300"
                        style={{
                          width:
                            statistics.submitted > 0
                              ? `${(statistics.graded / statistics.submitted) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
          </div>
        </Card>

        {/* ============ STATISTIK ============ */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {/* Total Siswa */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-600">
                  Total Siswa
                </CardTitle>
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {statistics.total}
              </p>
              <p className="text-xs text-gray-500 mt-1">Peserta tugas</p>
            </CardContent>
          </Card>

          {/* Sudah Mengumpulkan */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-600">
                  Mengumpulkan
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {statistics.submitted}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {statistics.total > 0
                  ? Math.round((statistics.submitted / statistics.total) * 100)
                  : 0}
                %
              </p>
            </CardContent>
          </Card>

          {/* Belum Mengumpulkan */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-600">
                  Belum Kumpul
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {statistics.notSubmitted}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {statistics.total > 0
                  ? Math.round(
                      (statistics.notSubmitted / statistics.total) * 100,
                    )
                  : 0}
                %
              </p>
            </CardContent>
          </Card>

          {/* Rata-rata Nilai */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-600">
                  Rata-rata
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {statistics.averageGrade}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Dari {statistics.graded} siswa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ============ TOOLBAR ============ */}
        <div className="flex flex-col gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 sticky top-3 z-40">
          {/* Search */}
          <div className="w-full relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama atau NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200 focus:bg-white text-sm h-9 sm:h-10"
            />
          </div>

          {/* Filter dan Refresh */}
          <div className="flex gap-2 w-full">
            <Select
              value={filterStatus}
              onValueChange={(value) =>
                setFilterStatus(value as FilterStatusValue)
              }
            >
              <SelectTrigger className="flex-1 bg-gray-50 border-gray-200 text-sm h-9 sm:h-10">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="submitted">Sudah Mengumpulkan</SelectItem>
                <SelectItem value="not_submitted">
                  Belum Mengumpulkan
                </SelectItem>
                <SelectItem value="graded">Sudah Dinilai</SelectItem>
                <SelectItem value="not_graded">Belum Dinilai</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-gray-200 hover:bg-gray-50 h-9 sm:h-10 w-9 sm:w-10 flex-shrink-0"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Result info */}
          <p className="text-xs text-gray-500 font-medium">
            Menampilkan {filteredData.length} dari {submissions.length} siswa
          </p>
        </div>

        {/* ============ CONTENT ============ */}
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card className="border-0 shadow-md bg-white overflow-hidden">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base">Daftar Siswa</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50 border-b border-gray-200">
                      <TableRow className="hover:bg-gray-50">
                        <TableHead className="text-xs font-semibold text-gray-600 w-10 px-3 py-3">
                          No
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-3">
                          NIS
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-3">
                          Nama
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-3">
                          Kelas
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-3">
                          Status
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 text-center px-3 py-3">
                          Nilai
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 px-3 py-3">
                          Waktu Submit
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 text-right px-3 py-3">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <AlertCircle className="h-6 w-6 text-gray-300" />
                              <p className="text-xs text-gray-500 font-medium">
                                Tidak ada data yang sesuai dengan filter
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredData.map((student, index) => (
                          <TableRow
                            key={student.student_id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors h-12"
                          >
                            <TableCell className="text-xs text-gray-600 font-medium ps-4 py-2">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-xs font-mono text-gray-900 px-3 py-2">
                              {student.nis}
                            </TableCell>
                            <TableCell className="text-xs text-gray-900 font-medium px-3 py-2">
                              <span className="line-clamp-1">
                                {student.name}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-gray-600 px-3 py-2">
                              {student.className}
                            </TableCell>
                            <TableCell className="px-3 py-2">
                              {student.status === "belum_mengumpulkan" ? (
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 border-red-200 text-xs"
                                >
                                  Belum
                                </Badge>
                              ) : student.isGraded ? (
                                <Badge className="bg-emerald-600 text-white text-xs">
                                  Dinilai
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
                                >
                                  Proses
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-center font-bold px-3 py-2">
                              <span className="text-emerald-600">
                                {student.grade ?? "-"}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-gray-600 px-3 py-2">
                              <span className="line-clamp-1">
                                {student.submittedAt ?? "-"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right px-3 py-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(student)}
                                className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                Lihat
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2">
            {filteredData.length === 0 ? (
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="h-8 w-8 text-gray-300" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Tidak ada data
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tidak ada siswa yang sesuai dengan filter
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredData.map((student, index) => (
                <StudentCard
                  key={student.student_id}
                  student={student}
                  index={index + 1}
                  onOpenDialog={handleOpenDialog}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ============ DIALOG PENILAIAN ============ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6 gap-4">
          {selectedStudent && (
            <>
              {/* Header */}
              <DialogHeader className="pb-3 border-b border-gray-200">
                <div className="space-y-3">
                  <DialogTitle className="text-lg sm:text-xl">
                    {selectedStudent.name}
                  </DialogTitle>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 text-xs">
                    <div>
                      <p className="text-gray-500">NIS</p>
                      <p className="font-mono font-semibold text-gray-900 mt-1">
                        {selectedStudent.nis}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Kelas</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {selectedStudent.className}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <div className="mt-1">
                        {getStatusBadge(
                          selectedStudent.status,
                          selectedStudent.isGraded,
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Jawaban */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    Jawaban Siswa
                  </h3>
                  {selectedStudent.status === "belum_mengumpulkan" ? (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <AlertCircle className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 font-medium text-xs">
                        Siswa belum mengumpulkan tugas.
                      </p>
                    </div>
                  ) : selectedStudent.answer ? (
                    <Card className="border border-gray-200 bg-gray-50">
                      <CardContent className="p-3">
                        <div
                          className="
              quill-content
              max-h-64 overflow-y-auto
              text-sm text-gray-900 leading-relaxed
              [&_p]:mb-2 [&_p:last-child]:mb-0
              [&_strong]:font-semibold [&_em]:italic [&_u]:underline
              [&_s]:line-through
              [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-3
              [&_h2]:text-base [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3
              [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mb-1 [&_h3]:mt-2
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_ol]:space-y-1
              [&_li]:leading-relaxed
              [&_a]:text-emerald-600 [&_a]:underline [&_a]:break-all
              [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-2
              [&_code]:bg-gray-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
              [&_pre.ql-syntax]:bg-gray-900 [&_pre.ql-syntax]:text-white [&_pre.ql-syntax]:p-2 [&_pre.ql-syntax]:rounded-md [&_pre.ql-syntax]:overflow-x-auto [&_pre.ql-syntax]:text-xs [&_pre.ql-syntax]:my-2
              [&_img]:max-w-full [&_img]:rounded-md [&_img]:my-2
              [&_hr]:my-3 [&_hr]:border-gray-300

              /* --- Quill-specific alignment classes --- */
              [&_.ql-align-center]:text-center
              [&_.ql-align-right]:text-right
              [&_.ql-align-justify]:text-justify

              /* --- Quill indent classes (level 1-8) --- */
              [&_.ql-indent-1]:pl-6
              [&_.ql-indent-2]:pl-12
              [&_.ql-indent-3]:pl-[4.5rem]
              [&_.ql-indent-4]:pl-24
              [&_.ql-indent-5]:pl-[7.5rem]
              [&_.ql-indent-6]:pl-36
              [&_.ql-indent-7]:pl-[10.5rem]
              [&_.ql-indent-8]:pl-48

              /* --- Quill font-size classes --- */
              [&_.ql-size-small]:text-xs
              [&_.ql-size-large]:text-lg
              [&_.ql-size-huge]:text-2xl

              break-words
            "
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(selectedStudent.answer),
                          }}
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <p className="text-gray-600 font-medium text-xs">
                        Tidak ada jawaban
                      </p>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Nilai */}
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-900 text-sm">
                    Nilai (0-100)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Masukkan nilai..."
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm h-10"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Feedback */}
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-900 text-sm">
                    Feedback
                  </label>
                  <textarea
                    placeholder="Berikan masukan dan evaluasi untuk siswa..."
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-emerald-500 outline-none resize-none text-sm"
                    rows={4}
                  />
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="pt-3 border-t border-gray-200 gap-2 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="border-gray-300 hover:bg-gray-50 text-sm order-2 sm:order-1"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveGrade}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm order-1 sm:order-2"
                >
                  Simpan
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
