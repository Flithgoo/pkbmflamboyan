import Link from "next/link";
import { PlusCircle, FileText } from "lucide-react";
import { getTutorSubject } from "@/lib/api/tutor_subject";
import { getUser } from "@/lib/api/user";

export default async function MapelPage() {
  const { data: tutor } = await getUser();
  if (!tutor) {
    return <div className="text-red-500">Gagal memuat data tutor.</div>;
  }
  const { data: subjects } = await getTutorSubject(tutor.id);

  return (
    <div className="min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 flex items-center gap-2">
            Mata Pelajaran
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Daftar mata pelajaran yang diampu
          </p>
        </div>
        <Link
          href="/LMS/tutor/materi/tambah"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition"
        >
          <PlusCircle size={20} />
          Tambah Materi
        </Link>
      </header>
      <main>
        <section className="bg-white rounded-2xl shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold text-emerald-700 mb-4">
            Daftar Mata Pelajaran
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(subjects?.length ?? 0) > 0 ? (
              (subjects ?? []).map(({ subject }: any) => (
                <Link
                  href={`/LMS/tutor/Mapel/${subject.id}`}
                  key={subject.id}
                  className="border border-emerald-200 rounded-xl p-4 flex justify-between flex-col gap-2 shadow hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="text-amber-500" size={22} />
                    <span className="font-bold text-emerald-700 text-base">
                      {subject.name}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{subject.description}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400">
                      Dibuat tgl:{" "}
                      {new Date(subject.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                Belum ada materi yang dibuat.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
