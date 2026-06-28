"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";

// ============================================================
// DUMMY DATA
// ============================================================

const assignmentData = {
  id: "mat-001",
  title: "Analisis Puisi Modern Indonesia",
  subject: "Bahasa Indonesia",
  tutor: "Dr. Siti Nurhaliza",
  deadline: "2024-01-25 23:59",
  totalStudents: 32,
  submittedCount: 28,
  gradedCount: 15,
  averageGrade: 82.5,
};

const studentSubmissionsData = [
  {
    id: "sub-001",
    studentName: "Ahmad Rizki Pratama",
    nis: "2023001",
    class: "XII IPA 1",
    status: "submitted",
    grade: 85,
    submittedAt: "2024-01-20 14:30",
    answer:
      "Puisi modern Indonesia memiliki ciri khas yang unik dalam penggunaan bahasa dan inovasi bentuk. Melalui analisis mendalam terhadap karya-karya penyair kontemporer, kita dapat memahami bagaimana perkembangan sastra Indonesia mencerminkan perubahan sosial dan budaya masyarakat.",
  },
  {
    id: "sub-002",
    studentName: "Bella Maharani Putri",
    nis: "2023002",
    class: "XII IPA 1",
    status: "submitted",
    grade: null,
    submittedAt: "2024-01-19 09:15",
    answer:
      "Perkembangan puisi modern dimulai dari era reformasi sastra Indonesia. Penyair-penyair muda menciptakan inovasi dalam bentuk dan isi yang lebih bebas dibanding puisi tradisional. Karakteristik utamanya adalah penggunaan bahasa yang lebih ekspresif dan simbolis.",
  },
  {
    id: "sub-003",
    studentName: "Chandra Wijaya Kusuma",
    nis: "2023003",
    class: "XII IPA 1",
    status: "submitted",
    grade: 78,
    submittedAt: "2024-01-21 16:45",
    answer:
      "Analisis puisi modern Indonesia menunjukkan evolusi signifikan dalam penggunaan metafora dan personifikasi untuk mengekspresikan emosi kompleks.",
  },
  {
    id: "sub-004",
    studentName: "Dina Sari Lestari",
    nis: "2023004",
    class: "XII IPA 1",
    status: "not_submitted",
    grade: null,
    submittedAt: null,
    answer: null,
  },
  {
    id: "sub-005",
    studentName: "Eka Saputra Wijaya",
    nis: "2023005",
    class: "XII IPA 1",
    status: "submitted",
    grade: 92,
    submittedAt: "2024-01-18 10:20",
    answer:
      "Puisi modern Indonesia merupakan wadah ekspresi artistik yang memadukan tradisi dengan inovasi kontemporer. Analisis komprehensif menunjukkan bahwa perubahan bentuk dan gaya puisi mencerminkan dinamika masyarakat modern yang terus berkembang.",
  },
  {
    id: "sub-006",
    studentName: "Farah Azizah Rahman",
    nis: "2023006",
    class: "XII IPA 1",
    status: "submitted",
    grade: 88,
    submittedAt: "2024-01-22 13:00",
    answer:
      "Kajian tentang puisi modern Indonesia memberikan wawasan mendalam mengenai pergeseran paradigma dalam sastra kontemporer.",
  },
  {
    id: "sub-007",
    studentName: "Gita Permata Sari",
    nis: "2023007",
    class: "XII IPA 1",
    status: "not_submitted",
    grade: null,
    submittedAt: null,
    answer: null,
  },
  {
    id: "sub-008",
    studentName: "Hendri Sutrisno",
    nis: "2023008",
    class: "XII IPA 2",
    status: "submitted",
    grade: 95,
    submittedAt: "2024-01-17 08:45",
    answer:
      "Analisis mendalam terhadap puisi modern Indonesia mengungkapkan kompleksitas dalam penggunaan simbol dan kiasan yang menciptakan makna berlapis.",
  },
  {
    id: "sub-009",
    studentName: "Ida Nurjanah Sari",
    nis: "2023009",
    class: "XII IPA 2",
    status: "not_submitted",
    grade: null,
    submittedAt: null,
    answer: null,
  },
  {
    id: "sub-010",
    studentName: "Joko Wardoyo",
    nis: "2023010",
    class: "XII IPA 2",
    status: "submitted",
    grade: 81,
    submittedAt: "2024-01-23 15:30",
    answer:
      "Puisi modern Indonesia menampilkan keragaman tema dan pendekatan artistik yang mencerminkan semangat zaman baru.",
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function PenilaianPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [gradeInput, setGradeInput] = useState<string>("");
  const [feedbackInput, setFeedbackInput] = useState<string>("");

  // Handle dialog open
  const handleOpenDialog = (student: any) => {
    setSelectedStudent(student);
    setGradeInput(student.grade?.toString() || "");
    setFeedbackInput("");
    setIsDialogOpen(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStudent(null);
    setGradeInput("");
    setFeedbackInput("");
  };

  // Handle save grade (dummy)
  const handleSaveGrade = () => {
    console.log("Save grade:", {
      studentId: selectedStudent.id,
      grade: gradeInput,
      feedback: feedbackInput,
    });
    handleCloseDialog();
  };

  // Handle refresh (dummy)
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Filter and search logic
  const filteredData = useMemo(() => {
    return studentSubmissionsData.filter((student) => {
      const matchSearch =
        student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nis.includes(searchQuery);

      let matchFilter = true;
      if (filterStatus === "submitted") {
        matchFilter = student.status === "submitted";
      } else if (filterStatus === "not_submitted") {
        matchFilter = student.status === "not_submitted";
      } else if (filterStatus === "graded") {
        matchFilter = student.grade !== null;
      } else if (filterStatus === "not_graded") {
        matchFilter = student.status === "submitted" && student.grade === null;
      }

      return matchSearch && matchFilter;
    });
  }, [searchQuery, filterStatus]);

  // Get status badge
  const getStatusBadge = (status: string, grade: number | null) => {
    if (status === "not_submitted") {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Belum Mengumpulkan
        </Badge>
      );
    }
    if (grade !== null) {
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

  // Get status badge compact (for table)
  const getStatusBadgeCompact = (status: string, grade: number | null) => {
    if (status === "not_submitted") {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 text-xs py-0.5"
        >
          Belum
        </Badge>
      );
    }
    if (grade !== null) {
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-0.5">
          Dinilai
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200 text-xs py-0.5"
      >
        Proses
      </Badge>
    );
  };

  // Get grade display
  const getGradeDisplay = (grade: number | null) => {
    if (grade === null) return "-";
    return <span className="font-bold text-lg text-emerald-600">{grade}</span>;
  };

  // Get grade display compact
  const getGradeDisplayCompact = (grade: number | null) => {
    if (grade === null) return "-";
    return <span className="text-emerald-600">{grade}</span>;
  };

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* HEADER */}
        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <CardHeader className="pb-4">
              <div className="space-y-3">
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-emerald-900">
                    {assignmentData.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-emerald-700 mt-1">
                    {assignmentData.subject} • {assignmentData.tutor}
                  </CardDescription>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-600">
                      Progres Penilaian
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {Math.round(
                        (assignmentData.gradedCount /
                          assignmentData.submittedCount) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-300"
                      style={{
                        width: `${(assignmentData.gradedCount / assignmentData.submittedCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Deadline
                    </p>
                    <p className="font-semibold text-sm text-gray-900">
                      {assignmentData.deadline}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Total Siswa
                    </p>
                    <p className="font-semibold text-sm text-gray-900">
                      {assignmentData.totalStudents}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Sudah Submit
                    </p>
                    <p className="font-semibold text-sm text-emerald-600">
                      {assignmentData.submittedCount}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Rata-rata Nilai
                    </p>
                    <p className="font-semibold text-sm text-emerald-600">
                      {assignmentData.averageGrade}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </div>
        </Card>

        {/* STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
              <p className="text-2xl font-bold text-gray-900">
                {assignmentData.totalStudents}
              </p>
              <p className="text-xs text-gray-500 mt-1">Peserta tugasnya</p>
            </CardContent>
          </Card>

          {/* Sudah Mengumpulkan */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-600">
                  Sudah Mengumpulkan
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-2xl font-bold text-gray-900">
                {assignmentData.submittedCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(
                  (assignmentData.submittedCount /
                    assignmentData.totalStudents) *
                    100,
                )}
                % dari total
              </p>
            </CardContent>
          </Card>

          {/* Belum Mengumpulkan */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-600">
                  Belum Mengumpulkan
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-2xl font-bold text-gray-900">
                {assignmentData.totalStudents - assignmentData.submittedCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(
                  ((assignmentData.totalStudents -
                    assignmentData.submittedCount) /
                    assignmentData.totalStudents) *
                    100,
                )}
                % dari total
              </p>
            </CardContent>
          </Card>

          {/* Rata-rata Nilai */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-600">
                  Rata-rata Nilai
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-2xl font-bold text-gray-900">
                {assignmentData.averageGrade}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Dari {assignmentData.gradedCount} siswa yang dinilai
              </p>
            </CardContent>
          </Card>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          {/* Search */}
          <div className="w-full sm:w-56 relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="Cari nama atau NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200 focus:bg-white text-sm h-8"
            />
          </div>

          {/* Filter dan Refresh */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-50 border-gray-200 text-sm h-8">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
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
              disabled={isLoading}
              className="border-gray-200 hover:bg-gray-50 h-8 w-8"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* TABEL */}
        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-base">Daftar Siswa</CardTitle>
            <CardDescription className="text-xs">
              Menampilkan {filteredData.length} dari{" "}
              {studentSubmissionsData.length} siswa
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 border-b border-gray-200">
                  <TableRow className="hover:bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-600 w-10 h-10 px-2 py-1">
                      No
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 h-10 px-2 py-1">
                      NIS
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 h-10 px-2 py-1">
                      Nama
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 h-10 px-2 py-1">
                      Kelas
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 h-10 px-2 py-1">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 text-center h-10 px-2 py-1">
                      Nilai
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 h-10 px-2 py-1">
                      Waktu Submit
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 text-right h-10 px-2 py-1">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow
                        key={i}
                        className="border-b border-gray-100 h-9"
                      >
                        <TableCell className="px-2 py-1">
                          <Skeleton className="h-3 w-4" />
                        </TableCell>
                        <TableCell className="px-2 py-1">
                          <Skeleton className="h-3 w-12" />
                        </TableCell>
                        <TableCell className="px-2 py-1">
                          <Skeleton className="h-3 w-28" />
                        </TableCell>
                        <TableCell className="px-2 py-1">
                          <Skeleton className="h-3 w-16" />
                        </TableCell>
                        <TableCell className="px-2 py-1">
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell className="px-2 py-1">
                          <Skeleton className="h-3 w-6 mx-auto" />
                        </TableCell>
                        <TableCell className="px-2 py-1">
                          <Skeleton className="h-3 w-20" />
                        </TableCell>
                        <TableCell className="px-2 py-1">
                          <Skeleton className="h-6 w-14" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredData.length === 0 ? (
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
                        key={student.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors h-9"
                      >
                        <TableCell className="text-xs text-gray-600 font-medium px-2 py-1">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-gray-900 px-2 py-1">
                          {student.nis}
                        </TableCell>
                        <TableCell className="text-xs text-gray-900 font-medium px-2 py-1">
                          <span className="line-clamp-1">
                            {student.studentName}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600 px-2 py-1">
                          {student.class}
                        </TableCell>
                        <TableCell className="px-2 py-1">
                          {getStatusBadgeCompact(student.status, student.grade)}
                        </TableCell>
                        <TableCell className="text-xs text-center font-bold px-2 py-1">
                          {getGradeDisplayCompact(student.grade)}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600 px-2 py-1">
                          <span className="line-clamp-1">
                            {student.submittedAt || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right px-2 py-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(student)}
                            className="h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
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

      {/* DIALOG PENILAIAN */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              {/* Header */}
              <DialogHeader className="pb-3 border-b border-gray-200">
                <div className="space-y-2">
                  <DialogTitle className="text-xl">
                    {selectedStudent.studentName}
                  </DialogTitle>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <div>
                      <p className="text-gray-500 text-xs">NIS</p>
                      <p className="font-mono font-semibold text-gray-900">
                        {selectedStudent.nis}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Kelas</p>
                      <p className="font-semibold text-gray-900">
                        {selectedStudent.class}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Status</p>
                      <div className="mt-1">
                        {getStatusBadge(
                          selectedStudent.status,
                          selectedStudent.grade,
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
                  {selectedStudent.status === "not_submitted" ? (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <AlertCircle className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 font-medium text-xs">
                        Siswa belum mengumpulkan tugas.
                      </p>
                    </div>
                  ) : (
                    <Card className="border border-gray-200 bg-gray-50">
                      <CardContent className="p-3">
                        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap line-clamp-6">
                          {selectedStudent.answer}
                        </p>
                      </CardContent>
                    </Card>
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
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
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
              <DialogFooter className="pt-3 border-t border-gray-200 gap-2">
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="border-gray-300 hover:bg-gray-50 text-sm"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveGrade}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
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
