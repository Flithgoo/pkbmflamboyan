"use client";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function PenggunaCard({
  userClass,
  tutors,
  formAction,
  handleDelete,
  handleEdit,
}: {
  userClass: any[];
  tutors: { id: number; name: string }[];
  formAction: (formData: FormData) => Promise<void>;
  handleDelete: (classId: number) => void;
  handleEdit: (
    classId: number,
    updatedData: { name?: string; tutorId?: number; description?: string }
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<string>("");
  const [errorTutor, setErrorTutor] = useState<string>("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold text-emerald-700">Daftar Kelas</h2>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition">
            <FaPlus />
            Tambah Mapel
          </Button>
        </DialogTrigger>
      </div>

      {/* tabel daftar mapel */}
      {/* <UserTable
        userClass={userClass}
        onDelete={handleDelete}
        onEdit={handleEdit}
      /> */}

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
                      <SelectItem key={tutor.id} value={tutor.id.toString()}>
                        {tutor.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* {errorTutor && (
                      <p className="text-red-600 text-sm mt-1">{errorTutor}</p>
                    )} */}
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
                // onClick={() => setSelectedTutor("")}
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
  );
}
