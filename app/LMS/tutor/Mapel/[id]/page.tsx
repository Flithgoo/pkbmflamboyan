"use client";

import Link from "next/link";
// ✅ BARU: Import ikon Clock
import {
  FileText,
  ArrowLeft,
  Paperclip,
  Youtube,
  Upload,
  Link as LinkLogo,
  Clock,
  X,
  FileQuestion,
  FilePen,
  FileType,
  FileVolume,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { isQuillEmpty } from "@/app/utils/react-quill-helper";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useUserStore } from "@/src/store/useUserStore";
import { getAllLocation } from "@/lib/api/location";
import { Classes, Location, Material, Subject } from "@/lib/types/types";
import { Input } from "@headlessui/react";
import { getAllClasses } from "@/lib/api/classes";
import { getSubjectById } from "@/lib/api/subject";
import { addMaterialAction } from "@/lib/actions/material";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Close } from "@radix-ui/react-popover";
import { getMaterialBySubjectId } from "@/lib/api/material";
import { useRouter } from "next/navigation";

// Dummy data (bisa dihapus jika sudah terhubung API)
const dummyMaterial = [
  {
    id: 1,
    title: "Operasi Hitung Dasar",
    description:
      "Penjelasan tentang penjumlahan, pengurangan, perkalian, dan pembagian.",
    created_at: "2025-07-10",
  },
  {
    id: 2,
    title: "Pengenalan Pecahan",
    description: "Materi tentang konsep pecahan dan penggunaannya.",
    created_at: "2025-07-12",
  },
];

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function MateriMapelPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter(); // ✅ 2. Inisialisasi router
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Omit<Classes, "created_at">[]>([]);
  const [value, setValue] = useState("");
  const { user } = useUserStore();
  const [subject, setSubject] = useState<Subject>({} as Subject);
  const [location, setLocation] = useState<Omit<Location, "created_at">[]>([]);
  const [classes, setClasses] = useState<Omit<Classes, "created_at">[]>([]);
  const [jenisUpload, setJenisUpload] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAbsensiEnabled, setIsAbsensiEnabled] = useState(false);
  const [absensiStart, setAbsensiStart] = useState("");
  const [absensiEnd, setAbsensiEnd] = useState("");
  const [material, setMaterial] = useState<Material[]>([]);

  const subjectId = params.id as unknown as number;

  // ✅ 1. Ekstrak logika fetching ke dalam fungsi terpisah dengan useCallback
  const fetchData = useCallback(async () => {
    // Anda bisa menambahkan state loading di sini jika mau
    const { data } = await getAllLocation();
    const { data: classes } = await getAllClasses();
    const { data: subject } = await getSubjectById(subjectId);
    const { data: material } = await getMaterialBySubjectId(subjectId);

    setMaterial(
      Array.isArray(material) ? material : material ? [material] : []
    );
    setSubject(subject ?? ({} as Subject));
    setLocation(data ?? []);
    setClasses(classes ?? []);
  }, [subjectId]); // Dependensi tetap subjectId

  useEffect(() => {
    // ✅ 2. Panggil fungsi fetchData saat komponen dimuat
    fetchData();
  }, [fetchData]);

  // ✅ BARU: useEffect untuk mengatur waktu default saat form dibuka
  useEffect(() => {
    // Jalankan hanya jika form dibuka dan absensiStart belum diatur
    if (open && isAbsensiEnabled && !absensiStart) {
      const now = new Date();
      // Menyesuaikan dengan zona waktu lokal untuk format input datetime-local
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const formattedDateTime = now.toISOString().slice(0, 16);
      setAbsensiStart(formattedDateTime);
    }
  }, [open, isAbsensiEnabled, absensiStart]);

  const toggleSelect = (kelas: Omit<Location, "created_at">) => {
    setSelected((prev) =>
      prev.includes(kelas) ? prev.filter((c) => c !== kelas) : [...prev, kelas]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === classes.length) {
      setSelected([]);
    } else {
      setSelected(classes);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (
      !jenisUpload ||
      !lokasi ||
      selected.length === 0 ||
      !title.trim() ||
      isQuillEmpty(value)
    ) {
      setError("Harap lengkapi semua field sebelum posting.");
      return;
    }
    if (isAbsensiEnabled && (!absensiStart || !absensiEnd)) {
      setError("Harap isi rentang waktu absensi jika fitur diaktifkan.");
      return;
    }
    if (isAbsensiEnabled && new Date(absensiStart) >= new Date(absensiEnd)) {
      setError("Waktu selesai absensi harus setelah waktu mulai.");
      return;
    }

    const payload = {
      jenis_upload: jenisUpload,
      location_id: lokasi as unknown as number,
      kelas: selected,
      title,
      content: value,
      tutor_id: user?.id as number,
      mapel_id: Number(params.id),
      is_absensi_enabled: isAbsensiEnabled,
      absensi_start: isAbsensiEnabled ? absensiStart : undefined,
      absensi_end: isAbsensiEnabled ? absensiEnd : undefined,
    };

    try {
      setLoading(true);
      const { success } = await addMaterialAction(payload);
      if (!success) throw new Error("Gagal menambahkan materi.");

      console.log("Data terkirim:", payload);
      alert("Materi berhasil diposting!");
      await fetchData();

      router.refresh();
      // Reset form dan tutup
      setOpen(false);
      setSelected([]);
      setJenisUpload("");
      setLokasi("");
      setTitle("");
      setValue("");
      setIsAbsensiEnabled(false);
      setAbsensiStart("");
      setAbsensiEnd("");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengirim data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 flex items-center gap-2">
            Materi {subject?.name || "Mapel"}
          </h1>
        </div>
        <Link
          href="/LMS/tutor/Mapel"
          className="text-sm flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold shadow transition"
        >
          <ArrowLeft size={20} />
          Kembali ke Daftar Mapel
        </Link>
      </header>
      <main>
        <section className="grid grid-cols-1 gap-4 bg-white rounded-2xl shadow p-4 md:p-6">
          {/* bagian upload materi/tugas/pengumuman */}
          <div className="w-full gap-2">
            <div
              className="bg-white rounded-lg shadow hover:border-emerald-200 border p-4 cursor-text"
              onClick={() => !open && setOpen(true)}
            >
              {!open ? (
                <div className="flex items-center text-gray-600">
                  <Image
                    src={
                      user?.profile_picture
                        ? user?.profile_picture
                        : "/assets/placeholder_profile/placeholder_avatar.png"
                    }
                    alt="avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="text-sm text-gray-500">
                    Umumkan sesuatu kepada kelas Anda
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-wrap items-center sm:justify-start gap-4 mb-3">
                    <Select value={jenisUpload} onValueChange={setJenisUpload}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Pilih jenis upload" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Pilih Jenis Upload</SelectLabel>
                          <SelectItem value="Materi">Materi</SelectItem>
                          <SelectItem value="Tugas">Tugas</SelectItem>
                          <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select value={lokasi} onValueChange={setLokasi}>
                      <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Pilih lokasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Pilih lokasi mengajar</SelectLabel>
                          {location.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id.toString()}>
                              {loc.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="w-[140px]" variant="outline">
                          {selected.length > 0
                            ? `Terpilih: ${selected.length} kelas`
                            : "Pilih kelas"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3">
                        <div className="space-y-2">
                          {/* ✅ TAMBAHAN: Wrapper untuk header dengan flexbox */}
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">Pilih Kelas</h4>
                            {/* ✅ TAMBAHAN: Tombol close dengan ikon X */}
                            <Close asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </Close>
                          </div>

                          {/* Tombol "Pilih Semua" tetap di bawah header */}
                          <Button
                            variant="secondary"
                            className="hover:bg-emerald-200 text-xs w-full" // Dibuat full-width agar lebih rapi
                            type="button"
                            onClick={toggleSelectAll}
                          >
                            Pilih Semua
                          </Button>

                          <div className="max-h-48 overflow-y-auto pr-2">
                            {" "}
                            {/* Optional: Tambahkan scroll jika daftar kelas panjang */}
                            {classes.map((kelas) => (
                              <div
                                key={kelas.id}
                                className="flex items-center space-x-2 py-1"
                              >
                                <Checkbox
                                  id={kelas.id.toString()}
                                  checked={selected.includes(kelas)}
                                  onCheckedChange={() => toggleSelect(kelas)}
                                />
                                <label
                                  htmlFor={kelas.id.toString()}
                                  className="text-sm w-full cursor-pointer" // Label bisa diklik
                                >
                                  {kelas.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="absensi-toggle"
                        checked={isAbsensiEnabled}
                        disabled={jenisUpload === "Pengumuman"}
                        onCheckedChange={setIsAbsensiEnabled}
                      />
                      <Label
                        htmlFor="absensi-toggle"
                        className="cursor-pointer"
                      >
                        Aktifkan Absensi
                      </Label>
                    </div>
                  </div>

                  {/* ✅ DIUBAH: Blok JSX untuk absensi dengan styling baru */}
                  {isAbsensiEnabled && (
                    <div className="grid sm:grid-cols-2 gap-4 mb-4 p-4 border rounded-lg bg-emerald-50/50">
                      <div>
                        <label
                          htmlFor="absensiStart"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Waktu Absensi Dibuka
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type="datetime-local"
                            id="absensiStart"
                            value={absensiStart}
                            onChange={(e) => setAbsensiStart(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition duration-200 hover:border-emerald-300"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="absensiEnd"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Waktu Absensi Ditutup
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type="datetime-local"
                            id="absensiEnd"
                            value={absensiEnd}
                            onChange={(e) => setAbsensiEnd(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition duration-200 hover:border-emerald-300"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Input
                    type="text"
                    placeholder="Judul materi"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-3 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  <ReactQuill theme="snow" value={value} onChange={setValue} />
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                  <div className="flex flex-col xs:flex-row justify-between mt-3">
                    <div className="flex gap-3 text-gray-600">
                      <div className="cursor-pointer rounded-full border hover:bg-emerald-100 border-emerald-100 p-2">
                        <Paperclip className=" w-4 h-4" />
                      </div>
                      <div className="cursor-pointer rounded-full border hover:bg-emerald-100 border-emerald-100 p-2">
                        <Youtube className=" w-4 h-4" />
                      </div>
                      <div className="cursor-pointer rounded-full border hover:bg-emerald-100 border-emerald-100 p-2">
                        <Upload className=" w-4 h-4" />
                      </div>
                      <div className="cursor-pointer rounded-full border hover:bg-emerald-100 border-emerald-100 p-2">
                        <LinkLogo className=" w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2 xs:mt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => {
                          setError("");
                          setOpen(false);
                        }}
                      >
                        Batal
                      </Button>
                      <Button
                        size="sm"
                        type="submit"
                        disabled={loading || !title}
                        className="rounded-full"
                      >
                        {loading ? "Mengirim..." : "Posting"}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* daftar materi yang sudah diupload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {material.length > 0 ? (
              material.map((materi) => (
                <div
                  key={materi.id}
                  className="border border-emerald-100 rounded-xl p-4 flex flex-col gap-2 shadow hover:shadow-lg transition"
                >
                  {/* jenis logo berdasarkan type */}
                  <div className="flex items-center gap-2">
                    {materi.upload_type === "Tugas" ? (
                      <FilePen className="text-red-500" size={22} />
                    ) : materi.upload_type === "Pengumuman" ? (
                      <FileVolume className="text-amber-500" size={22} />
                    ) : (
                      <FileText className="text-emerald-500" size={22} />
                    )}
                    <span className="font-bold text-emerald-700 text-base">
                      {materi.title}
                    </span>
                  </div>
                  {/* materi yang sudah di cut jika kepanjangan */}
                  <p
                    className="text-gray-600 text-sm"
                    dangerouslySetInnerHTML={{
                      __html:
                        (materi.content ?? "").length > 200
                          ? (materi.content ?? "").slice(0, 200) + "..."
                          : materi.content ?? "",
                    }}
                  ></p>
                  <div className="flex justify-between h-full items-end mt-2">
                    <span className="text-xs text-gray-400">
                      Dibuat:{" "}
                      {new Date(materi.created_at).toLocaleDateString("id-ID")}
                    </span>
                    <Link
                      href={`/LMS/tutor/materi/${materi.id}`}
                      className="text-emerald-600 hover:text-amber-600 font-semibold text-sm"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                Belum ada materi untuk mapel ini.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
