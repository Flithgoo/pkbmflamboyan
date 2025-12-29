"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, ArrowLeft } from "lucide-react";
import { getSubjectById } from "@/lib/api/subject";
import { getMaterialBySubjectId } from "@/lib/api/material";
import {
  getActiveSessionByMaterial,
  getAttendanceForUser,
} from "@/lib/api/attendance";
import { markAttendanceAction } from "@/lib/actions/attendance";
import { useRouter } from "next/navigation";

export default function MapelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [subject, setSubject] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<Record<number, any>>({});
  const [attendances, setAttendances] = useState<Record<number, boolean>>({});
  const [loadingMapel, setLoadingMapel] = useState(false);

  const subjectId = Number(params.id);

  useEffect(() => {
    async function fetchData() {
      setLoadingMapel(true);
      const { data: s } = await getSubjectById(subjectId);
      const { data: m } = await getMaterialBySubjectId(subjectId);
      setSubject(s ?? null);
      // Ensure materials is always an array
      const mats = Array.isArray(m) ? m : m ? [m] : [];
      setMaterials(mats);

      // For each material check active session and user's attendance
      const sessionsMap: Record<number, any> = {};
      const attendanceMap: Record<number, boolean> = {};

      await Promise.all(
        mats.map(async (mat: any) => {
          if (mat?.is_absensi_enabled) {
            const { data: session } = await getActiveSessionByMaterial(mat.id);
            if (session) {
              sessionsMap[mat.id] = session;
              const { data: att } = await getAttendanceForUser(session.id);
              attendanceMap[session.id] = Array.isArray(att) && att.length > 0;
            }
          }
        })
      );

      setActiveSessions(sessionsMap);
      setAttendances(attendanceMap);
      setLoadingMapel(false);
    }

    fetchData();
  }, [subjectId]);

  async function handleAbsen(sessionId: number) {
    try {
      const { success, error } = await markAttendanceAction(sessionId);
      if (!success) return alert(error || "Gagal absen");
      // mark as attended locally
      setAttendances((prev) => ({ ...prev, [sessionId]: true }));
      alert("Absensi berhasil dicatat");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Terjadi kesalahan saat absen");
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-emerald-50 to-amber-50">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-emerald-700">
            {subject?.name ?? "Mapel"}
          </h1>
          {subject?.description && (
            <p className="text-sm text-gray-600">{subject.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href="/LMS/pelajar/Mapel"
            className="px-4 py-2 bg-amber-500 text-white rounded-lg flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Kembali
          </Link>
        </div>
      </header>

      <main className="grid gap-4">
        <section className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-3">Daftar Materi</h2>
          {loadingMapel ? (
            <p>Memuat...</p>
          ) : materials.length === 0 ? (
            <p>Belum ada materi.</p>
          ) : (
            materials.map((mat) => {
              const session = activeSessions[mat.id];
              const hasAttended = session ? attendances[session.id] : false;
              const isActive = Boolean(session);

              return (
                <div
                  key={mat.id}
                  className="border-b last:border-b-0 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <h3 className="font-medium">{mat.title}</h3>
                    {mat.description && (
                      <p className="text-sm text-gray-600">{mat.description}</p>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {mat.created_at &&
                        new Date(mat.created_at).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {mat.is_absensi_enabled ? (
                      isActive ? (
                        hasAttended ? (
                          <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-700 text-sm">
                            Sudah Absen
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAbsen(session.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded"
                          >
                            <Clock size={16} /> Absen
                          </button>
                        )
                      ) : (
                        <span className="px-3 py-1 rounded bg-gray-100 text-gray-600 text-sm">
                          Absensi tidak aktif
                        </span>
                      )
                    ) : (
                      <span className="px-3 py-1 rounded bg-gray-50 text-gray-500 text-sm">
                        Tanpa absensi
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}
