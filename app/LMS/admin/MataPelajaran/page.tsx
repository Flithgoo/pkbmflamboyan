"use client";

import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import {
  addTutorSubjectAction,
  deleteSubjectAction,
  editSubjectAction,
} from "@/lib/actions/subject";
import { getAllTutor } from "@/lib/api/tutor";
import { getAllTutorSubjectClasses } from "@/lib/api/tutor_subject";
import SubjectTable from "@/app/components/LMS/admin/(MataPelajaran)/SubjectTable";
import ConfirmDeleteSubjectModal from "@/app/components/LMS/admin/(MataPelajaran)/ConfirmDeleteSubjectModal";
import { getAllClasses } from "@/lib/api/classes";
import { Classes } from "@/lib/types/types";
import {
  Popover,
  PopoverTrigger,
  NonPortalPopoverContent,
} from "@/components/ui/popover";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function AturKelas() {
  // state untuk data
  const [tutorSubjects, setTutorSubjects] = useState<any[]>([]); // daftar mapel + tutor
  const [tutors, setTutors] = useState<any[]>([]); // daftar tutor

  // state untuk UI/Modal
  const [open, setOpen] = useState(false); // modal tambah mapel
  const [openEdit, setOpenEdit] = useState(false); // modal edit
  const [editSubject, setEditSubject] = useState<any | null>(null); // subject yang sedang diedit
  const [showDelete, setShowDelete] = useState(false); // modal konfirmasi hapus
  const [selectedTutor, setSelectedTutor] = useState<any | null>(null); // tutor yang dipilih
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null); // subject/mapel yang dipilih
  const [errorTutor, setErrorTutor] = useState<string>(""); // validasi jika tutor belum dipilih
  const [classes, setClasses] = useState<any[]>([]); // daftar kelas
  const [selected, setSelected] = useState<Omit<Classes, "created_at">[]>([]);
  const [openPopover, setOpenPopover] = useState(false);

  // formState = { success: boolean, error?: string }
  const [formState, formAction] = useFormState(addTutorSubjectAction, {
    success: false,
  });

  // jika form berhasil -> refresh data + tutup modal
  useEffect(() => {
    if (formState.success) {
      (async () => {
        const { data } = await getAllTutorSubjectClasses();
        setTutorSubjects(data ?? []);
      })();
      setOpen(false);
      setSelectedTutor("");
      setSelected([]);
      setOpen(false);
    }
  }, [formState.success]);

  // ambil data awal (tutor, mapel, kelas)
  useEffect(() => {
    (async () => {
      const { data: tutors } = await getAllTutor();
      const { data: subjects } = await getAllTutorSubjectClasses();
      const { data: classes } = await getAllClasses();

      setTutors(tutors ?? []);
      setTutorSubjects(subjects ?? []);
      setClasses(classes ?? []);
    })();
  }, []);

  const toggleSelect = (kelas: Omit<Classes, "created_at">) => {
    setSelected((prev) =>
      prev.some((c) => c.id === kelas.id)
        ? prev.filter((c) => c.id !== kelas.id)
        : [...prev, kelas],
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === classes.length) {
      setSelected([]);
    } else {
      setSelected(classes);
    }
  };

  // handle delete subject/mapel
  async function handleConfirmDelete() {
    if (!selectedSubject) return;

    const result = await deleteSubjectAction(selectedSubject.id);

    if (result?.success) {
      setShowDelete(false); // tutup modal delete
      // refresh data setelah hapus
      const { data } = await getAllTutorSubjectClasses();
      setTutorSubjects(data ?? []);
    } else {
      alert("Gagal menghapus mata pelajaran. Silakan coba lagi.");
      console.error("Error deleting subject:", result?.error);
    }
  }

  async function handleEdit(subject: any) {
    setEditSubject(subject);

    if (subject.tutor_subjects.length > 0) {
      setSelectedTutor(subject.tutor_subjects[0].users);
    } else {
      setSelectedTutor(null);
    }

    // default checked classes
    const defaultClasses = subject.subject_classes.map(
      (item: any) => item.classes,
    );

    if (defaultClasses.length > 0) {
      setSelected(defaultClasses);
    } else {
      setSelected([]);
    }

    setOpenEdit(true);
  }

  // trigger delete modal
  function handleDelete(subject: any) {
    setSelectedSubject(subject);
    setShowDelete(true);
  }

  return (
    <div className="min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 pt-8 md:p-8">
      {/* header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-emerald-700">
          Atur Mata Pelajaran
        </h1>
      </header>

      <main>
        <section
          id="daftar-materi"
          className="bg-white rounded-2xl shadow p-6 mt-6 overflow-x-auto"
        >
          {/* dialog untuk tambah mapel */}
          <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
              <h2 className="text-xl font-semibold text-emerald-700">
                Daftar Kelas
              </h2>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition">
                  <FaPlus />
                  Tambah Mapel
                </Button>
              </DialogTrigger>
            </div>

            {/* tabel daftar mapel */}
            <SubjectTable
              tutorSubjects={tutorSubjects}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />

            {/* modal tambah mapel */}
            <DialogContent className="sm:max-w-[425px] text-emerald-700">
              <form
                action={formAction}
                onSubmit={(e) => {
                  // validasi -> tutor wajib dipilih
                  if (!selectedTutor) {
                    e.preventDefault();
                    setErrorTutor("Pilih tutor terlebih dahulu");
                  } else {
                    setErrorTutor("");
                  }
                  if (!selected || selected.length === 0) {
                    e.preventDefault();
                    setErrorTutor("Pilih kelas terlebih dahulu");
                  } else {
                    setErrorTutor("");
                  }
                }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl pb-4">
                    Tambah Mata Pelajaran
                  </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                  {/* input nama mapel */}
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Nama</Label>
                    <Input
                      id="name-1"
                      name="name"
                      placeholder="Nama Mapel"
                      required
                    />
                  </div>
                  {/* select tutor */}
                  <div className="grid gap-3">
                    <Label htmlFor="tutor-selector">Tutor</Label>
                    <Select
                      name="tutor"
                      value={selectedTutor}
                      onValueChange={(value) => setSelectedTutor(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pilih tutor" />
                      </SelectTrigger>
                      <SelectContent className="grid gap-2">
                        <SelectGroup>
                          {tutors.map((tutor) => (
                            <SelectItem
                              key={tutor.id}
                              value={tutor.id.toString()}
                            >
                              {tutor.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errorTutor && (
                      <p className="text-red-600 text-sm mt-1">{errorTutor}</p>
                    )}
                  </div>

                  {/* pilih kelas */}
                  <div className="grid gap-3">
                    <Label htmlFor="kelas-selector">Kelas</Label>
                    <Popover open={openPopover} onOpenChange={setOpenPopover}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          className="w-[180px]"
                          variant="outline"
                        >
                          {selected.length > 0
                            ? `Terpilih: ${selected.length} kelas`
                            : "Pilih kelas"}
                        </Button>
                      </PopoverTrigger>

                      <NonPortalPopoverContent
                        align="start"
                        className="w-64 p-3"
                      >
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Pilih Kelas</h4>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setOpenPopover(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Tombol pilih semua */}
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full text-xs"
                            onClick={toggleSelectAll}
                          >
                            {selected.length === classes.length
                              ? "Batalkan Semua"
                              : "Pilih Semua"}
                          </Button>

                          {/* List kelas */}
                          <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                            {classes.map((kelas) => (
                              <div
                                key={kelas.id}
                                className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-muted"
                              >
                                <Checkbox
                                  id={`kelas-${kelas.id}`}
                                  checked={selected.some(
                                    (s) => s.id === kelas.id,
                                  )}
                                  onCheckedChange={() => toggleSelect(kelas)}
                                />

                                <label
                                  htmlFor={`kelas-${kelas.id}`}
                                  className="cursor-pointer text-sm w-full"
                                >
                                  {kelas.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </NonPortalPopoverContent>
                    </Popover>
                    {/* input tersembunyi untuk kelas yang dipilih */}
                    <input
                      type="hidden"
                      name="classes"
                      value={JSON.stringify(selected.map((s) => s.id))} // kirim sebagai array id kelas bertipe number
                    />
                  </div>

                  {/* deskripsi mapel */}
                  <div className="grid gap-3">
                    <Label htmlFor="description">Deskripsi</Label>
                    <textarea
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                      id="description"
                      name="description"
                      placeholder="Deskripsi singkat mata pelajaran"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={() => setSelectedTutor("")}
                      className="my-2"
                      variant="outline"
                    >
                      Batal
                    </Button>
                  </DialogClose>
                  <Button className="sm:my-2 mt-5" type="submit">
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* dialog untuk edit mapel */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="sm:max-w-[425px] text-emerald-700">
              <form
                action={async (formData) => {
                  if (!selectedTutor) {
                    setErrorTutor("Pilih tutor terlebih dahulu");
                    return;
                  }
                  if (!selected || selected.length === 0) {
                    setErrorTutor("Pilih kelas terlebih dahulu");
                    return;
                  }
                  const result = await editSubjectAction(
                    editSubject.id,
                    formData,
                  );

                  if (result.success) {
                    const { data } = await getAllTutorSubjectClasses();
                    setTutorSubjects(data ?? []);
                    setOpenEdit(false);
                    setEditSubject(null);
                    setSelectedTutor("");
                  } else {
                    alert("Gagal update mapel");
                  }
                }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl pb-4">
                    Edit Mata Pelajaran
                  </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                  {/* input nama */}
                  <div className="grid gap-3">
                    <Label htmlFor="edit-name">Nama</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      defaultValue={editSubject?.name}
                      required
                    />
                  </div>

                  {/* select tutor */}
                  <div className="grid gap-3">
                    <Label htmlFor="edit-tutor">Tutor</Label>
                    <Select
                      name="tutor"
                      defaultValue={selectedTutor?.id}
                      onValueChange={(value) => setSelectedTutor(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pilih tutor">
                          {selectedTutor?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="grid gap-2">
                        <SelectGroup>
                          {tutors.map((tutor) => (
                            <SelectItem
                              key={tutor.id}
                              value={tutor.id.toString()}
                            >
                              {tutor.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errorTutor && (
                      <p className="text-red-600 text-sm mt-1">{errorTutor}</p>
                    )}
                  </div>

                  {/* pilih kelas */}
                  <div className="grid gap-3">
                    <Label htmlFor="kelas-selector">Kelas</Label>
                    <Popover open={openPopover} onOpenChange={setOpenPopover}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          className="w-[180px]"
                          variant="outline"
                        >
                          {selected.length > 0
                            ? `Terpilih: ${selected.length} kelas`
                            : "Pilih kelas"}
                        </Button>
                      </PopoverTrigger>

                      <NonPortalPopoverContent
                        align="start"
                        className="w-64 p-3"
                      >
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Pilih Kelas</h4>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setOpenPopover(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Tombol pilih semua */}
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full text-xs"
                            onClick={toggleSelectAll}
                          >
                            {selected.length === classes.length
                              ? "Batalkan Semua"
                              : "Pilih Semua"}
                          </Button>

                          {/* List kelas */}
                          <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                            {classes.map((kelas) => (
                              <div
                                key={kelas.id}
                                className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-muted"
                              >
                                <Checkbox
                                  id={`kelas-${kelas.id}`}
                                  checked={selected.some(
                                    (s) => s.id === kelas.id,
                                  )}
                                  onCheckedChange={() => toggleSelect(kelas)}
                                />

                                <label
                                  htmlFor={`kelas-${kelas.id}`}
                                  className="cursor-pointer text-sm w-full"
                                >
                                  {kelas.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </NonPortalPopoverContent>
                    </Popover>
                    {/* input tersembunyi untuk kelas yang dipilih */}
                    <input
                      type="hidden"
                      name="classes"
                      value={JSON.stringify(selected.map((s) => s.id))} // kirim sebagai array id kelas bertipe number
                    />
                  </div>

                  {/* deskripsi mapel*/}
                  <div className="grid gap-3">
                    <Label htmlFor="edit-description">Deskripsi</Label>
                    <textarea
                      id="edit-description"
                      name="description"
                      defaultValue={editSubject?.description}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                      placeholder="Deskripsi singkat mata pelajaran"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        setOpenEdit(false);
                        setSelectedTutor("");
                      }}
                      className="my-2"
                      variant="outline"
                    >
                      Batal
                    </Button>
                  </DialogClose>
                  <Button className="sm:my-2 mt-5" type="submit">
                    Simpan Perubahan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </section>
      </main>

      {/* modal konfirmasi hapus */}
      <ConfirmDeleteSubjectModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
        subject={selectedSubject}
      />
    </div>
  );
}
