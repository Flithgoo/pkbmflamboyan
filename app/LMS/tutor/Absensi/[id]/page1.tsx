"use client";

import { useMemo, useState } from "react";
import { Search, ArrowLeft, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type AttendanceStatus =
  | "hadir_online"
  | "hadir_offline"
  | "izin"
  | "belum_absen"
  | "tidak_hadir";

type StudentAttendance = {
  attendance_id: number;
  student_id: number;
  student_name: string;
  attendance_status: AttendanceStatus;
};

const dummyStudents: StudentAttendance[] = [
  {
    attendance_id: 1,
    student_id: 1,
    student_name: "Andi Saputra",
    attendance_status: "hadir_online",
  },
  {
    attendance_id: 2,
    student_id: 2,
    student_name: "Budi Santoso",
    attendance_status: "hadir_offline",
  },
  {
    attendance_id: 3,
    student_id: 3,
    student_name: "Cici Amelia",
    attendance_status: "izin",
  },
  {
    attendance_id: 4,
    student_id: 4,
    student_name: "Dedi Pratama",
    attendance_status: "belum_absen",
  },
  {
    attendance_id: 5,
    student_id: 5,
    student_name: "Eka Putri",
    attendance_status: "tidak_hadir",
  },
  {
    attendance_id: 6,
    student_id: 6,
    student_name: "Fajar",
    attendance_status: "belum_absen",
  },
];

export default function AttendancePage() {
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<"semua" | AttendanceStatus>("semua");

  const [students, setStudents] = useState<StudentAttendance[]>(dummyStudents);

  function updateStatus(attendanceId: number, status: AttendanceStatus) {
    setStudents((prev) =>
      prev.map((student) =>
        student.attendance_id === attendanceId
          ? {
              ...student,
              attendance_status: status,
            }
          : student,
      ),
    );
  }

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchSearch = student.student_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchFilter =
        filter === "semua" ? true : student.attendance_status === filter;

      return matchSearch && matchFilter;
    });
  }, [students, search, filter]);

  const statistics = useMemo(() => {
    return {
      hadir: students.filter(
        (s) =>
          s.attendance_status === "hadir_online" ||
          s.attendance_status === "hadir_offline",
      ).length,

      izin: students.filter((s) => s.attendance_status === "izin").length,

      belum: students.filter((s) => s.attendance_status === "belum_absen")
        .length,

      total: students.length,
    };
  }, [students]);

  function getBadge(status: AttendanceStatus) {
    switch (status) {
      case "hadir_online":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Hadir Online
          </Badge>
        );

      case "hadir_offline":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Hadir Offline
          </Badge>
        );

      case "izin":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Izin
          </Badge>
        );

      case "belum_absen":
        return <Badge variant="secondary">Belum Absen</Badge>;

      case "tidak_hadir":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Tidak Hadir
          </Badge>
        );
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Header */}

        <div className="space-y-3">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={18} />
            Kembali
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-orange-600">
              Kelola Absensi
            </h1>

            <p className="text-muted-foreground">Algoritma Dasar</p>

            <p className="text-sm text-muted-foreground">
              Informatika • Kelas 7,8,9 • Pondok A
            </p>

            <p className="text-sm text-muted-foreground">08:00 - 10:00 WIB</p>
          </div>
        </div>

        {/* Statistik */}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Hadir</p>

              <p className="text-3xl font-bold text-green-600">
                {statistics.hadir}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Izin</p>

              <p className="text-3xl font-bold text-yellow-600">
                {statistics.izin}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Belum</p>

              <p className="text-3xl font-bold">{statistics.belum}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total</p>

              <p className="text-3xl font-bold text-orange-600">
                {statistics.total}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-muted-foreground"
          />

          <Input
            className="pl-10"
            placeholder="Cari nama siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter */}

        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            "semua",
            "hadir_online",
            "hadir_offline",
            "izin",
            "belum_absen",
            "tidak_hadir",
          ].map((item) => (
            <Button
              key={item}
              size="sm"
              variant={filter === item ? "default" : "outline"}
              onClick={() => setFilter(item as "semua" | AttendanceStatus)}
            >
              {item
                .replaceAll("_", " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </Button>
          ))}
        </div>

        {/* Student List */}

        <div className="grid gap-4">
          {filteredStudents.map((student) => (
            <Card
              key={student.attendance_id}
              className="transition hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users size={18} />

                      <h3 className="font-semibold">{student.student_name}</h3>
                    </div>

                    {getBadge(student.attendance_status)}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatus(student.attendance_id, "hadir_offline")
                      }
                    >
                      Hadir
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        updateStatus(student.attendance_id, "izin")
                      }
                    >
                      Izin
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStatus(student.attendance_id, "belum_absen")
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sticky Footer */}

      <div className="fixed bottom-4 left-4 right-4 md:hidden">
        <Card className="shadow-xl">
          <CardContent className="p-3 text-center text-sm font-medium">
            Hadir {statistics.hadir} • Izin {statistics.izin} • Total{" "}
            {statistics.total}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
