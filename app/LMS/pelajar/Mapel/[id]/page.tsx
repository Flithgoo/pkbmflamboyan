"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  FileText,
  ClipboardList,
  Megaphone,
  Calendar,
  User,
  ArrowLeft,
} from "lucide-react";
import { getSubjectByIdJoinTutorName } from "@/lib/api/subject";
import { getStudentMaterialsBySubjectId } from "@/lib/api/material";
import { useUserStore } from "@/src/store/useUserStore";
import { Subject } from "@/lib/types/types";
import Link from "next/link";
import { stripHtmlAndTruncate } from "@/app/utils/react-quill-helper";

type SubjectWithTutor = Subject & {
  tutor_name: string;
};

export default function SubjectPage(props: { params: { id: string } }) {
  const [subject, setSubject] = useState<SubjectWithTutor>({
    id: 0,
    name: "",
    description: "",
    created_at: "",
    tutor_name: "",
  });
  const [materials, setMaterials] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const subjectId = props.params.id;
  const { user } = useUserStore();

  useEffect(() => {
    async function initialFetch() {
      const { data: subjectData } = await getSubjectByIdJoinTutorName(
        Number(subjectId),
      );

      const { data: materialsData } = await getStudentMaterialsBySubjectId(
        Number(subjectId),
        Number(user?.id),
      );

      if (materialsData) {
        const materialsWithTutor = materialsData;
        console.log(
          "🚀 ~ initialFetch ~ materialsWithTutor:",
          materialsWithTutor,
        );
        setMaterials(materialsWithTutor);
      }

      if (subjectData) {
        const transformedSubject: SubjectWithTutor = {
          ...subjectData,
          tutor_name: subjectData.tutor_subjects?.[0]?.users?.name ?? "",
        };
        console.log(
          "🚀 ~ initialFetch ~ transformedSubject:",
          transformedSubject,
        );

        setSubject(transformedSubject);
      }
    }

    if (user?.id) {
      initialFetch();
    }
  }, [subjectId, user?.id]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const matchSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchFilter = filter === "Semua" || item.upload_type === filter;

      return matchSearch && matchFilter;
    });
  }, [materials, search, filter]);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Materi":
        return "bg-emerald-100 text-emerald-700";
      case "Tugas":
        return "bg-amber-100 text-amber-700";
      case "Pengumuman":
        return "bg-sky-100 text-sky-700";
      default:
        return "";
    }
  };

  const getAttendanceBadge = (status: string | null) => {
    switch (status) {
      case "hadir_online":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Hadir Online
          </span>
        );

      case "hadir_offline":
        return (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            Hadir Offline
          </span>
        );

      case "izin":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Izin
          </span>
        );

      case "tidak_hadir":
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Tidak Hadir
          </span>
        );

      case "belum_absen":
        return (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
            Belum Absen
          </span>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8">
      {/* HEADER */}
      <section className="flex flex-col lg:flex-row justify-between mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-xl">
        <div className="p-8 text-white">
          <div className="mb-3 flex items-center gap-3">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-3xl font-bold md:text-4xl">{subject.name}</h1>
          </div>

          <p className="max-w-3xl text-emerald-100">
            {subject.description || "Tidak ada deskripsi"}
          </p>

          <div className="mt-6 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur">
            {filteredMaterials.length} Materi Tersedia
          </div>
        </div>
        <div className="pt-0 lg:pt-8 p-8 justify-center items-end">
          <Link
            href={`/LMS/pelajar/Mapel`}
            className="text-sm flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold shadow transition"
          >
            <ArrowLeft size={20} />
            Kembali ke Daftar Mapel
          </Link>
        </div>
      </section>

      {/* FILTER */}
      <section className="mb-8 rounded-2xl bg-white p-4 shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              placeholder="Cari materi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-emerald-400"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-400"
          >
            <option>Semua</option>
            <option>Materi</option>
            <option>Tugas</option>
            <option>Pengumuman</option>
          </select>
        </div>
      </section>

      {/* LIST */}
      {filteredMaterials.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-md">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-emerald-500" />

          <h2 className="text-xl font-semibold text-gray-800">
            Belum Ada Materi
          </h2>

          <p className="mt-2 text-gray-500">
            Belum ada materi yang tersedia untuk mata pelajaran ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMaterials.map((material) => (
            <article
              key={material.id}
              className="group rounded-3xl border border-emerald-100 bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col p-6">
                {/* BADGE */}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeColor(
                      material.upload_type,
                    )}`}
                  >
                    {material.upload_type}
                  </span>

                  {getAttendanceBadge(material.attendance_status)}
                </div>

                {/* ICON */}
                <div className="mb-4">
                  {material.upload_type === "Materi" && (
                    <FileText className="h-8 w-8 text-emerald-600" />
                  )}

                  {material.upload_type === "Tugas" && (
                    <ClipboardList className="h-8 w-8 text-amber-600" />
                  )}

                  {material.upload_type === "Pengumuman" && (
                    <Megaphone className="h-8 w-8 text-sky-600" />
                  )}
                </div>

                {/* TITLE */}
                <h2 className="min-h-[4rem] mb-3 line-clamp-2 text-lg font-bold text-gray-800">
                  {material.title}
                </h2>

                {/* PREVIEW */}
                <p className="mb-5 line-clamp-3 text-sm text-gray-600">
                  {stripHtmlAndTruncate(material.content)}
                </p>

                {/* INFO */}
                <div className="space-y-2 border-t pt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{material.tutor_name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {new Date(material.created_at).toLocaleDateString(
                        "id-ID",
                      )}
                    </span>
                  </div>
                </div>

                {/* BUTTON */}
                <Link
                  href={`/LMS/pelajar/Mapel/${subjectId}/Materi/${material.id}`}
                  className="text-center mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 font-medium text-white transition hover:from-emerald-600 hover:to-emerald-700"
                >
                  Lihat Materi
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
