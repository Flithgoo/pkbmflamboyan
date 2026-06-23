"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  Download,
  User,
  CheckCircle2,
  FileText,
  Clock,
  Award,
  NotebookPen,
  ArrowLeft,
  Send,
  AlertCircle,
  ClipboardList,
  CheckCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserStore } from "@/src/store/useUserStore";
import { getStudentWithMaterialDetail } from "@/lib/api/material";
import Link from "next/link";
import { studentCheckInAction } from "@/lib/actions/attendance";
import { submitAssignment } from "@/lib/api/assignment";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type AttendanceStatus =
  | "not_active"
  | "belum_absen"
  | "hadir_online"
  | "hadir_offline"
  | "izin"
  | "tidak_hadir";

type SubmissionStatus = "belum_mengumpulkan" | "sudah_mengumpulkan";

type MaterialDetail = {
  id: number;
  title: string;
  content: string;
  upload_type: string;

  subject_name: string;
  tutor_name: string;

  attendance_id: number;
  attendance_status: AttendanceStatus;
  attendance_start: string | null;
  attendance_end: string | null;

  created_at: string;
  file_url: string | null;

  due_date: string | null;

  submission_status: SubmissionStatus | null;
  answer: string | null;
  score: number | null;
  feedback: string | null;
  submitted_at: string | null;
};

export default function MaterialDetailPage({
  params,
}: {
  params: { id: string; materiId: string };
}) {
  const [material, setMaterial] = useState<MaterialDetail | null>(null);
  const [taskAnswer, setTaskAnswer] = useState<string>("");
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const materiId = params.materiId;
  const { user } = useUserStore();

  useEffect(() => {
    async function initialFetch() {
      try {
        const { data, error } = await getStudentWithMaterialDetail(
          Number(user?.id),
          Number(materiId),
        );

        if (error) {
          console.error(error);
          return;
        }

        if (data && data.length > 0) {
          const raw = data[0] as MaterialDetail;
          console.log("🚀 ~ initialFetch ~ raw:", raw);
          setMaterial(raw);
          setTaskAnswer(raw.answer ?? "");
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (user?.id) {
      initialFetch();
    }
  }, [materiId, user?.id]);

  if (!material) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat materi...</p>
        </div>
      </div>
    );
  }

  function formatDateTime(value: string | null) {
    if (!value) return "-";
    const date = new Date(value);
    const formattedDate = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
    const formattedTime = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
    return `${formattedDate}, ${formattedTime}`;
  }

  function formatMaterialDate(value: string) {
    const d = new Date(value);

    const datePart = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);

    const timePart = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${datePart}, ${timePart}`;
  }

  function isAttendanceOpen(start: string | null, end: string | null): boolean {
    if (!start || !end) return false;

    const now = new Date();

    return now >= new Date(start) && now <= new Date(end);
  }

  function isAttendanceClosed(end: string | null): boolean {
    if (!end) return false;

    return new Date() > new Date(end);
  }

  function renderAttendanceBadge(material: MaterialDetail) {
    switch (material.attendance_status) {
      case "not_active":
        return (
          <Badge variant="secondary" className="bg-slate-200 text-slate-700">
            Tidak Ada Absensi
          </Badge>
        );

      case "belum_absen":
        const open = isAttendanceOpen(
          material.attendance_start,
          material.attendance_end,
        );

        const closed = isAttendanceClosed(material.attendance_end);

        if (closed) {
          return (
            <Badge variant="destructive" className="bg-red-600 text-white">
              Absensi Ditutup
            </Badge>
          );
        }

        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">Belum Absen</Badge>
        );

      case "hadir_online":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700">
            Hadir Online
          </Badge>
        );

      case "hadir_offline":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700">
            Hadir Offline
          </Badge>
        );

      case "izin":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Izin</Badge>;

      case "tidak_hadir":
        return <Badge variant="destructive">Tidak Hadir</Badge>;
    }
  }

  function renderTaskStatusBadge(status?: string | null) {
    switch (status) {
      case "belum_mengumpulkan":
        return (
          <Badge className="bg-yellow-500 text-white">Belum Mengumpulkan</Badge>
        );

      case "sudah_mengumpulkan":
        return (
          <Badge className="bg-emerald-600 text-white">
            Sudah Mengumpulkan
          </Badge>
        );

      default:
        return <Badge variant="secondary">Tidak Ada Tugas</Badge>;
    }
  }

  const isEmpty = taskAnswer.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  async function handleSubmitTask() {
    if (isEmpty) {
      alert("Silakan isi jawaban terlebih dahulu");
      return;
    }

    setIsSubmittingTask(true);
    try {
      if (material) {
        const { error } = await submitAssignment(
          material.id,
          Number(user?.id),
          taskAnswer,
        );
        if (error) console.log(error);
      }

      setMaterial((prev) =>
        prev
          ? {
              ...prev,
              submission_status: "sudah_mengumpulkan",
              answer: taskAnswer,
              submitted_at: new Date().toISOString(),
            }
          : prev,
      );
      console.log("Tugas berhasil dikumpulkan dengan jawaban:", taskAnswer);
      alert("Tugas berhasil dikumpulkan!");
    } catch (err) {
      console.error(err);
      alert("Gagal mengumpulkan tugas. Silakan coba lagi.");
    } finally {
      setIsSubmittingTask(false);
    }
  }

  return (
    <div className="w-full min-h-screen p-2 md:p-3 md:pt-0">
      {/* Full Height Container */}
      <div className="relative flex flex-col">
        {/* Main Content  */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="flex justify-end">
                <Link
                  href={`/LMS/pelajar/Mapel/${params.id}`}
                  className="text-sm flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold shadow transition"
                >
                  <ArrowLeft size={20} />
                  Kembali ke Daftar Mapel
                </Link>
              </div>

              {/* Title Section */}
              <section className="flex flex-col gap-4 justify-between p-8 mb-8 border-2 overflow-hidden rounded-3xl border-emerald-200 bg-white/50 backdrop-blur shadow-lg transition-all">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg">
                    <Award size={14} className="mr-1" />
                    PKBM Flamboyan
                  </Badge>
                  {renderAttendanceBadge(material)}
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-emerald-700">
                  {material.title}
                </h1>
                <p className="text-lg text-slate-600">
                  {material.subject_name}
                </p>
              </section>

              {/* Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-emerald-100 bg-white/50 backdrop-blur hover:shadow-lg transition-all">
                  <CardContent className="pt-6 flex items-center gap-3">
                    <User size={20} className="text-emerald-600" />
                    <div>
                      <p className="text-sm text-slate-600">Tutor</p>
                      <p className="font-semibold text-slate-900">
                        {material.tutor_name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-amber-100 bg-white/50 backdrop-blur hover:shadow-lg transition-all">
                  <CardContent className="pt-6 flex items-center gap-3">
                    <Calendar size={20} className="text-amber-500" />
                    <div>
                      <p className="text-sm text-slate-600">Tanggal Materi</p>
                      <p className="font-semibold text-slate-900">
                        {formatMaterialDate(material.created_at)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Two Column Layout for Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Materi Pembelajaran */}
                <Card className="border-emerald-100 shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="rounded-t-xl bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border-b border-emerald-100">
                    <CardTitle className="flex items-center gap-2 text-emerald-700">
                      <BookOpen size={22} />
                      Materi Pembelajaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <article
                      className="prose prose-slate max-w-none
                        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-emerald-700 [&_h2]:mt-6 [&_h2]:mb-4
                        [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-emerald-600 [&_h3]:mt-5 [&_h3]:mb-3
                        [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:mb-4
                        [&_li]:text-slate-700 [&_li]:ml-6
                        [&_strong]:text-emerald-700 [&_strong]:font-bold
                        [&_ol]:list-decimal [&_ol]:space-y-2
                        [&_ul]:list-disc [&_ul]:space-y-2
                      "
                      dangerouslySetInnerHTML={{
                        __html: material.content,
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Lampiran */}
                {material.file_url && (
                  <Card className="border-amber-100 shadow-lg hover:shadow-xl transition-all">
                    <CardHeader className="rounded-t-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-100">
                      <CardTitle className="flex items-center gap-2 text-amber-700">
                        <FileText size={22} />
                        Lampiran File
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8">
                      <Button
                        asChild
                        size="lg"
                        className="w-full gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all font-semibold"
                      >
                        <a
                          href={material.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download size={20} />
                          Download File Materi
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Informasi Tugas */}
                {material.upload_type === "Tugas" && (
                  <>
                    <Card className="border-blue-100 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                      <CardHeader className="rounded-t-xl bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-b border-blue-100">
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                          <ClipboardList size={22} />
                          Informasi Tugas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-8 space-y-6">
                        {/* Deadline Section - HARDCODED */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                              <Clock size={16} />
                              Deadline
                            </span>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-2xl sm:text-3xl font-bold text-blue-700">
                              <p className="text-2xl font-bold text-blue-700">
                                {material.due_date
                                  ? Intl.DateTimeFormat("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    }).format(new Date(material.due_date))
                                  : "Tanggal belum tersedia"}
                              </p>
                            </p>
                            <p className="text-sm text-blue-600 font-semibold mt-1">
                              {material.due_date
                                ? Intl.DateTimeFormat("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }).format(new Date(material.due_date))
                                : "Jam belum tersedia"}
                              {" WIB"}
                            </p>
                          </div>
                        </div>

                        {/* Status Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                              <CheckCheck size={16} />
                              Status
                            </span>
                          </div>
                          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                            {renderTaskStatusBadge(material.submission_status)}
                            <AlertCircle className="w-6 h-6 text-yellow-500" />
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                        {/* Answer Section */}
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                            <FileText size={16} />
                            Jawaban Tugas
                          </label>

                          <div className="overflow-hidden rounded-xl border-2 border-blue-200 bg-white shadow-sm transition-all hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                            <ReactQuill
                              theme="snow"
                              value={taskAnswer}
                              onChange={setTaskAnswer}
                              placeholder="Tuliskan jawaban tugas Anda di sini..."
                              className="task-editor"
                            />
                          </div>

                          <p className="text-xs text-gray-500">
                            Pastikan jawaban Anda jelas dan lengkap sebelum
                            mengirim.
                          </p>
                        </div>

                        {/* Submit Button */}
                        <Button
                          onClick={handleSubmitTask}
                          disabled={isSubmittingTask || isEmpty}
                          size="lg"
                          className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all font-semibold text-base py-6"
                        >
                          {isSubmittingTask ? (
                            <>
                              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                              Mengirim Tugas...
                            </>
                          ) : (
                            <>
                              <Send size={20} />
                              {material.submission_status ===
                              "sudah_mengumpulkan"
                                ? "Perbarui Jawaban"
                                : "Kirim Tugas"}
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {material.score !== null && (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <span>Nilai</span>

                            <span className="text-3xl font-bold text-emerald-600">
                              {material.score}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {material.feedback && (
                      <Alert>
                        <AlertDescription>{material.feedback}</AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </div>

              {/* Sidebar - Attendance */}
              <div className="lg:col-span-1">
                <Card className="border-emerald-100 shadow-lg hover:shadow-xl transition-all sticky top-4">
                  <CardHeader className="rounded-t-xl bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border-b border-emerald-100">
                    <CardTitle className="flex items-center gap-2 text-emerald-700">
                      <NotebookPen size={22} />
                      Status Absensi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {renderAttendanceCard(material)}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function renderAttendanceCard(material: MaterialDetail) {
    switch (material.attendance_status) {
      case "not_active":
        return (
          <Alert className="border-slate-200 bg-slate-50">
            <AlertDescription className="text-slate-700">
              Materi ini tidak menggunakan absensi.
            </AlertDescription>
          </Alert>
        );

      case "belum_absen": {
        const open = isAttendanceOpen(
          material.attendance_start,
          material.attendance_end,
        );

        const closed = isAttendanceClosed(material.attendance_end);

        if (closed) {
          return (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-900">
                Absensi telah ditutup.
              </AlertDescription>
            </Alert>
          );
        }

        if (!open) {
          return (
            <Alert className="border-slate-200 bg-slate-50">
              <AlertDescription>Absensi belum dibuka.</AlertDescription>
            </Alert>
          );
        }

        return (
          <div className="space-y-4">
            <Alert className="border-amber-200 bg-amber-50">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                Silakan melakukan absensi sebelum batas waktu berakhir.
              </AlertDescription>
            </Alert>

            <div className="grid gap-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 p-4">
              <div className="flex flex-col items-center justify-between">
                <span className="font-medium text-slate-700">Mulai:</span>

                <span className="font-semibold text-emerald-600">
                  {formatDateTime(material.attendance_start)}
                </span>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

              <div className="flex flex-col items-center justify-between">
                <span className="font-medium text-slate-700">Berakhir:</span>

                <span className="font-semibold text-emerald-600">
                  {formatDateTime(material.attendance_end)}
                </span>
              </div>
            </div>

            <Button
              onClick={async () =>
                await handleAttendance(material.attendance_id, "hadir")
              }
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700"
            >
              Hadir
            </Button>

            <Button
              onClick={async () =>
                await handleAttendance(material.attendance_id, "izin")
              }
              size="lg"
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500"
            >
              Izin
            </Button>
          </div>
        );
      }

      case "hadir_online":
        return (
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-900">
              Anda telah melakukan absensi secara online.
            </AlertDescription>
          </Alert>
        );

      case "hadir_offline":
        return (
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-900">
              Tutor telah mencatat kehadiran Anda.
            </AlertDescription>
          </Alert>
        );

      case "izin":
        return (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertDescription className="text-amber-900">
              Status kehadiran Anda adalah izin.
            </AlertDescription>
          </Alert>
        );

      case "tidak_hadir":
        return (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-900">
              Anda tidak mengikuti sesi absensi ini.
            </AlertDescription>
          </Alert>
        );
    }
  }

  async function handleAttendance(attendanceId: number, status: string) {
    try {
      const { success, error } = await studentCheckInAction(
        attendanceId,
        status,
      );

      if (error)
        return (
          <Alert className="fixed top-2 left-1/2 transform -translate-x-1/2 border-slate-200 bg-slate-50">
            <AlertDescription className="text-slate-700">
              Gagal melakukan absensi: {error}
            </AlertDescription>
          </Alert>
        );

      if (success) {
        setMaterial((prev) =>
          prev
            ? {
                ...prev,
                attendance_status: status === "hadir" ? "hadir_online" : "izin",
              }
            : prev,
        );

        return (
          <Alert className="fixed top-2 left-1/2 transform -translate-x-1/2 border-slate-200 bg-slate-50">
            <AlertDescription className="text-slate-700">
              Absensi berhasil dilakukan.
            </AlertDescription>
          </Alert>
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}
