"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/useUserStore";
// API
import { getSubjectById } from "@/lib/api/subject";
import { getMaterialBySubjectId } from "@/lib/api/material";
import {
  getActiveSessionByMaterial,
  getAttendanceForUser,
} from "@/lib/api/attendance";
import { markAttendanceAction } from "@/lib/actions/attendance";

export default function MapelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const subjectId = Number(params.id);
  const { user } = useUserStore();

  // ===== STATE =====
  const [subject, setSubject] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<Record<number, any>>({});
  const [attendances, setAttendances] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);

  // ===== FETCH DATA UTAMA =====
  useEffect(() => {
    async function fetchMapelDetail() {
      setLoading(true);

      // Ambil data mapel & materi
      const [{ data: subjectData }, { data: materialData }] = await Promise.all(
        [getSubjectById(subjectId), getMaterialBySubjectId(subjectId)]
      );

      setSubject(subjectData ?? null);

      // Pastikan materi selalu array
      const mats = Array.isArray(materialData)
        ? materialData
        : materialData
        ? [materialData]
        : [];

      setMaterials(mats);

      // Ambil session aktif & status absensi user
      await fetchSessionsAndAttendance(mats);

      setLoading(false);
    }

    fetchMapelDetail();
  }, [subjectId]);

  // ===== FETCH SESSION & ABSENSI =====
  async function fetchSessionsAndAttendance(mats: any[]) {
    const sessions: Record<number, any> = {};
    const attendanceStatus: Record<number, boolean> = {};

    await Promise.all(
      mats.map(async (mat) => {
        // Skip jika materi tidak pakai absensi
        if (!mat?.is_absensi_enabled) return;

        // Ambil session aktif
        const { data: session } = await getActiveSessionByMaterial(mat.id);
        if (!session) return;

        sessions[mat.id] = session;

        // Cek apakah user sudah absen
        const { data: attendance } = await getAttendanceForUser(session.id);
        attendanceStatus[session.id] =
          Array.isArray(attendance) && attendance.length > 0;
      })
    );

    setActiveSessions(sessions);
    setAttendances(attendanceStatus);
  }

  // ===== HANDLE ABSEN =====
  async function handleAbsen(sessionId: number) {
    const { success, error } = await markAttendanceAction(sessionId);

    if (!success) {
      alert(error || "Gagal absen");
      return;
    }

    // Update state lokal agar UI langsung berubah
    setAttendances((prev) => ({ ...prev, [sessionId]: true }));
    alert("Absensi berhasil dicatat");
  }

  // ===== UI =====
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* HEADER */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-emerald-700">
            {subject?.name ?? "Mapel"}
          </h1>
          {subject?.description && (
            <p className="text-sm text-gray-600">{subject.description}</p>
          )}
        </div>

        <Link
          href="/LMS/pelajar/Mapel"
          className="px-4 py-2 bg-amber-500 text-white rounded-lg flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
      </header>

      {/* CONTENT */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="font-semibold mb-3">Daftar Materi</h2>

        {loading ? (
          <p>Memuat...</p>
        ) : materials.length === 0 ? (
          <p>Belum ada materi.</p>
        ) : (
          materials.map((mat) => {
            const session = activeSessions[mat.id];
            const isActive = Boolean(session);
            const hasAttended = session ? attendances[session.id] : false;

            return (
              <div
                key={mat.id}
                className="border-b last:border-b-0 py-3 flex flex-col md:flex-row md:justify-between gap-3"
              >
                {/* INFO MATERI */}
                <div>
                  <h3 className="font-medium">{mat.title}</h3>
                  {mat.description && (
                    <p className="text-sm text-gray-600">{mat.description}</p>
                  )}
                  {mat.created_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(mat.created_at).toLocaleString("id-ID")}
                    </p>
                  )}
                </div>

                {/* STATUS ABSENSI */}
                <div className="flex items-center gap-3">
                  {!mat.is_absensi_enabled && (
                    <span className="badge-gray">Tanpa absensi</span>
                  )}

                  {mat.is_absensi_enabled && !isActive && (
                    <span className="badge-gray">Absensi tidak aktif</span>
                  )}

                  {mat.is_absensi_enabled && isActive && hasAttended && (
                    <span className="badge-green">Sudah Absen</span>
                  )}

                  {mat.is_absensi_enabled && isActive && !hasAttended && (
                    <button
                      onClick={() => handleAbsen(session.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded"
                    >
                      <Clock size={16} /> Absen
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
