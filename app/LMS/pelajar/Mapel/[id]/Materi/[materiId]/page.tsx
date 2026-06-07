"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Download,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Award,
  Link,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AttendanceStatus =
  | "not_active"
  | "belum_absen"
  | "hadir_online"
  | "hadir_offline"
  | "izin"
  | "tidak_hadir";

export default function MaterialDetailPage() {
  const [material] = useState({
    id: 1,
    title: "Belajar Algoritma Dasar",
    tutor_name: "Tutor Informatika",
    subject_name: "Informatika",
    created_at: "2026-06-05",

    attendance_status: "belum_absen" as AttendanceStatus,

    attendance_start: "08.00 WIB",
    attendance_end: "12.00 WIB",

    file_url: "https://example.com/file.pdf",

    content: `
      <h2>Apa itu Algoritma?</h2>
      <p>
      Algoritma adalah langkah-langkah logis
      untuk menyelesaikan suatu masalah.
      </p>

      <h3>Contoh Algoritma Membuat Teh</h3>

      <ol>
        <li>Siapkan gelas</li>
        <li>Masukkan teh</li>
        <li>Tuang air panas</li>
        <li>Aduk</li>
      </ol>

      <p>
      Dalam informatika, algoritma digunakan
      untuk membuat program komputer.
      </p>
    `,
  });

  function renderAttendanceBadge() {
    switch (material.attendance_status) {
      case "not_active":
        return (
          <Badge variant="secondary" className="bg-slate-200 text-slate-700">
            Tidak Ada Absensi
          </Badge>
        );

      case "belum_absen":
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

  function renderAttendanceCard() {
    switch (material.attendance_status) {
      case "not_active":
        return (
          <Alert className="border-slate-200 bg-slate-50">
            <AlertDescription className="text-slate-700">
              Materi ini tidak menggunakan absensi.
            </AlertDescription>
          </Alert>
        );

      case "belum_absen":
        return (
          <div className="space-y-4">
            <Alert className="border-amber-200 bg-amber-50">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                Silakan melakukan absensi sebelum batas waktu berakhir.
              </AlertDescription>
            </Alert>

            <div className="grid gap-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">Mulai:</span>
                <span className="text-emerald-600 font-semibold">
                  {material.attendance_start}
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">Berakhir:</span>
                <span className="text-emerald-600 font-semibold">
                  {material.attendance_end}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg"
            >
              Hadir
            </Button>
          </div>
        );

      case "hadir_online":
        return (
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-900">
              ✓ Anda telah melakukan absensi secara online.
            </AlertDescription>
          </Alert>
        );

      case "hadir_offline":
        return (
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-900">
              ✓ Tutor telah mencatat kehadiran Anda.
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

  return (
    <div className="w-full min-h-screen p-4 md:p-8">
      {/* Full Height Container */}
      <div className="relative flex flex-col">
        {/* Main Content  */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Title Section */}
            <div className="space-y-4 animate-in fade-in duration-500">
              <section className="flex flex-col gap-4 justify-between p-8 mb-8 border-2 overflow-hidden rounded-3xl border-emerald-200 bg-white/50 backdrop-blur shadow-lg transition-all">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg">
                    <Award size={14} className="mr-1" />
                    PKBM Flamboyan
                  </Badge>
                  {renderAttendanceBadge()}
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
                        {new Date(material.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
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
                        className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all"
                      >
                        <a
                          href={material.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Download size={20} />
                          Download File Materi
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar - Attendance */}
              <div className="lg:col-span-1">
                <Card className="border-emerald-100 shadow-lg hover:shadow-xl transition-all sticky top-4">
                  <CardHeader className="rounded-t-xl bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border-b border-emerald-100">
                    <CardTitle className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 size={22} />
                      Status Absensi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {renderAttendanceCard()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
