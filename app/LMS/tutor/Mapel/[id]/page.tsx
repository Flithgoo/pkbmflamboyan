"use client";

import Link from "next/link";
import { BookOpen, FileText, ArrowLeft } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { isQuillEmpty } from "@/app/utils/react-quill-helper";
import { Paperclip, Youtube, Upload, Link as LinkLogo } from "lucide-react";
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

// Dummy data materi, ganti dengan fetch dari API sesuai id mapel
const material = [
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
const classes = [
  "Kelas 7",
  "Kelas 8",
  "Kelas 9",
  "Kelas 10",
  "Kelas 11",
  "Kelas 12",
];

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function MateriMapelPage({
  params,
}: {
  params: { id: string };
}) {
  // Di production, fetch materi berdasarkan params.id
  // const materiList = await getMateriByMapelId(params.id);
  const [open, setOpen] = useState(false); // state untuk mengatur form terbuka/tutup
  const [selected, setSelected] = useState<string[]>([]); // state penyimpan kelas terpilih
  const [value, setValue] = useState(""); // state untuk isi materi menggunakan ReactQuill

  const toggleSelect = (kelas: string) => {
    setSelected((prev) =>
      prev.includes(kelas) ? prev.filter((c) => c !== kelas) : [...prev, kelas]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === classes.length) {
      // kalau semua sudah terpilih -> kosongkan
      setSelected([]);
    } else {
      // kalau belum semua -> pilih semua
      setSelected(classes);
    }
  };

  // const handleSubmit = () => {
  //   // contoh: simpan ke backend atau console.log
  //   console.log("Kelas terpilih:", selected);
  //   alert(`Data terkirim: ${selected.join(", ")}`);
  // };

  return (
    <div className="min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 flex items-center gap-2">
            <BookOpen size={28} />
            Materi Mapel #{params.id}
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Daftar materi untuk mapel ini.
          </p>
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
        {/* pembungkus putih2 */}
        <section className="grid grid-cols-1 gap-4 bg-white rounded-2xl shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold text-emerald-700 mb-4">
            Materi
          </h2>
          <div className="w-full gap-2">
            <div
              className="bg-white rounded-lg shadow hover:border-emerald-200 border p-4 cursor-text"
              onClick={() => !open && setOpen(true)}
            >
              {!open ? (
                // Tampilan singkat (collapsed)
                <div className="flex items-center text-gray-600">
                  <img
                    src="https://placehold.co/40x40"
                    alt="avatar"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="text-sm text-gray-500">
                    Umumkan sesuatu kepada kelas Anda
                  </span>
                </div>
              ) : (
                // Tampilan penuh (expanded)
                <form>
                  <div className="flex items-center gap-2 mb-3">
                    {/* dropdown pilih jenis upload/posting */}
                    <Select>
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
                    {/* pilih kelas yang akan menerima materi */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="w-[140px]" variant="outline">
                          {selected.length > 0
                            ? `Terpilih: ${selected.length} kelas`
                            : "Pilih kelas"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Pilih Kelas</h4>
                          <div className="space-y-2">
                            <Button
                              variant={"secondary"}
                              className="hover:bg-emerald-200 text-xs"
                              onClick={() => {
                                selected.length === classes.length;
                                toggleSelectAll();
                              }}
                            >
                              Pilih Semua
                            </Button>
                            {classes.map((kelas) => (
                              <div
                                key={kelas}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={kelas}
                                  checked={selected.includes(kelas)}
                                  onCheckedChange={() => toggleSelect(kelas)}
                                />
                                <label htmlFor={kelas} className="text-sm">
                                  {kelas}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Textarea */}
                  <ReactQuill theme="snow" value={value} onChange={setValue} />

                  {/* Toolbar bawah */}
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

                    {/* tombol posting dan cancel */}
                    <div className="flex justify-end gap-2 mt-2 xs:mt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        Batal
                      </Button>
                      <Button
                        size="sm"
                        disabled={isQuillEmpty(value)}
                        className="rounded-full"
                      >
                        Posting
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
          {/* list materi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {material.length > 0 ? (
              material.map((materi) => (
                <div
                  key={materi.id}
                  className="border border-emerald-100 rounded-xl p-4 flex flex-col gap-2 shadow hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="text-amber-500" size={22} />
                    <span className="font-bold text-emerald-700 text-base">
                      {materi.title}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{materi.description}</p>
                  <div className="flex justify-between items-center mt-2">
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
