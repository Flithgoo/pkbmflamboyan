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
import {
  addTutorSubjectAction,
  deleteSubjectAction,
} from "@/lib/actions/subject";
import SubjectTable from "@/app/components/LMS/admin/SubjectTable";
import { getAllTutor } from "@/lib/api/tutor";
import { Label } from "@/components/ui/label";
import { getAllTutorSubject } from "@/lib/api/tutor_subject";
import ConfirmDeleteSubjectModal from "@/app/components/LMS/admin/(MataPelajaran)/ConfirmDeleteSubjectModal";

export default function AturKelas() {
  const [tutorSubjects, setTutorSubjects] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [errorTutor, setErrorTutor] = useState<string>("");

  // formState = { success: boolean, error?: string }
  const [formState, formAction] = useFormState(addTutorSubjectAction, {
    success: false,
  });

  // kalau success -> tutup dialog
  useEffect(() => {
    if (formState.success) {
      const fetchData = async () => {
        const { data } = await getAllTutorSubject();
        setTutorSubjects(data ?? []);
      };
      fetchData();
      setOpen(false);
    }
  }, [formState.success]);

  useEffect(() => {
    async function fetchData() {
      const { data: tutors } = await getAllTutor();
      const { data: subject } = await getAllTutorSubject();
      setTutorSubjects(subject ?? []);
      setTutors(tutors ?? []);
    }
    fetchData();
  }, []);

  async function handleConfirmDelete() {
    if (!selectedSubject) return;

    const result = await deleteSubjectAction(selectedSubject.id);

    if (result?.success) {
      setShowDelete(false); // Tutup modal
      // Refresh data
      const { data } = await getAllTutorSubject();
      setTutorSubjects(data ?? []);
    } else {
      alert("Gagal menghapus pengguna. Silakan coba lagi.");
      console.error("Error deleting subject:", result?.error);
    }
  }

  function handleDelete(subject: any) {
    setSelectedSubject(subject);
    setShowDelete(true);
  }

  return (
    <div className="min-h-screen flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 pt-8 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">
            Atur Mata Pelajaran
          </h1>
        </div>
      </header>
      <main>
        <section
          id="daftar-materi"
          className="bg-white rounded-2xl shadow p-6 mt-6 overflow-x-auto"
        >
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
            />

            {/* modal/dialog uintuk tambah mapel */}
            <DialogContent className="sm:max-w-[425px] text-emerald-700">
              <form
                action={formAction}
                method="POST"
                onSubmit={(e) => {
                  if (!selectedTutor) {
                    e.preventDefault(); // cegah submit
                    setErrorTutor("Pilih tutor terlebih dahulu");
                  } else {
                    setErrorTutor(""); // reset error
                  }
                }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl pb-4">
                    Tambah Mata Pelajaran
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Nama</Label>
                    <Input
                      id="name-1"
                      name="name"
                      placeholder="Nama Mapel"
                      required
                    />
                  </div>
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
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button className="my-2" variant="outline">
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
        </section>
      </main>

      <ConfirmDeleteSubjectModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
        subject={selectedSubject}
      />
    </div>
  );
}
