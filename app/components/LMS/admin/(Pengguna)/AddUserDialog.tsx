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
import { AnimatePresence, motion } from "framer-motion";
import { ClassCombobox } from "@/app/components/LMS/admin/(Pengguna)/ClassCombobox";
import { ProfilePhotoInput } from "@/app/components/LMS/admin/(Pengguna)/ProfilePhotoInput";

export default function PenggunaCard({
  classes,
  locations,
  formAction,
  isLoading,
}: {
  classes: { id: number; name: string }[];
  locations?: { id: number; name: string }[];
  formAction: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [errorRole, setErrorRole] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Tutor" },
    { id: 3, name: "Pelajar" },
  ];

  console.log("🚀 ~ PenggunaCard ~ selectedClass:", selectedClass);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold text-emerald-700">
          Daftar Pengguna
        </h2>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition">
            <FaPlus />
            Tambah Pengguna
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
      <DialogContent className="max-w-80 sm:max-w-[425px] max-h-[95vh] overflow-y-auto text-emerald-700">
        <form
          action={formAction}
          onSubmit={(e) => {
            // validasi -> role wajib dipilih
            if (!selectedRole) {
              e.preventDefault();
              setErrorRole("Pilih role terlebih dahulu");
            } else {
              setErrorRole("");
              // Reset form setelah submit
              setTimeout(() => {
                setOpen(false);
                setSelectedRole("");
                setSelectedClass("");
                setSelectedLocation("");
                setPhoto(null);
              }, 500);
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl pb-4">Tambah Pengguna</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {/* input nama */}
            <div className="grid gap-2">
              <Label htmlFor="name-1">Nama</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="Nama Lengkap"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Username / NIPD</Label>
              <Input
                id="username"
                name="username"
                placeholder="Username / NIPD"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            {/* select role */}
            <div className="grid gap-2">
              <Label htmlFor="role-selector">Role</Label>
              <Select
                name="role"
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value)}
              >
                <SelectTrigger id="role-selector" className="w-[180px]">
                  <SelectValue placeholder="Pilih Peran" />
                </SelectTrigger>
                <SelectContent className="grid gap-2">
                  <SelectGroup>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name.toLowerCase()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errorRole && (
                <p className="text-red-600 text-sm mt-1">{errorRole}</p>
              )}
            </div>

            {/* input kelas & lokasi jika role == pelajar */}
            <AnimatePresence>
              {selectedRole === "pelajar" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex justify-between gap-4"
                >
                  <ClassCombobox
                    value={selectedClass}
                    onChange={setSelectedClass}
                    classes={classes}
                  />
                  {/* input hidden untuk menyertakan selectedClass agar masuk formData */}
                  <input
                    type="hidden"
                    name="studentClass"
                    value={selectedClass}
                  />

                  <div className="grid gap-2">
                    <Label htmlFor="location-selector">Lokasi</Label>
                    <Select
                      name="location"
                      value={selectedLocation}
                      onValueChange={(value) => setSelectedLocation(value)}
                    >
                      <SelectTrigger
                        id="location-selector"
                        className="w-[180px]"
                      >
                        <SelectValue placeholder="Lokasi" />
                      </SelectTrigger>
                      <SelectContent className="grid gap-2">
                        <SelectGroup>
                          {(locations || []).map((location) => (
                            <SelectItem
                              key={location.id}
                              value={location.id.toString()}
                            >
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* foto profil */}
            <ProfilePhotoInput value={photo} onChange={setPhoto} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => setSelectedRole("")}
                className="my-2"
                variant="outline"
                disabled={isLoading}
              >
                Batal
              </Button>
            </DialogClose>
            <Button className="sm:my-2 mt-5" type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
