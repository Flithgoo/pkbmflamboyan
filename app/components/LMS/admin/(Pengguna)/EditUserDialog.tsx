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
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { ClassCombobox } from "@/app/components/LMS/admin/(Pengguna)/ClassCombobox";
import { ProfilePhotoInput } from "@/app/components/LMS/admin/(Pengguna)/ProfilePhotoInput";
import { useClassLocationStore } from "@/src/store/useClassLocationStore";
import { getUserLocationAndClass } from "@/lib/api/user";

export default function EditPenggunaCard({
  selectedUser,
  formAction,
  isLoading,
}: {
  selectedUser: any | null;
  formAction: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [errorRole, setErrorRole] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const classes = useClassLocationStore((s) => s.classes);
  const locations = useClassLocationStore((s) => s.locations);
  const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Tutor" },
    { id: 3, name: "Pelajar" },
  ];

  // NOTE: EditUserDialog is mounted per-row, safe to use defaultValue

  useEffect(() => {
    // Fetch user's class & location when the edit dialog is opened
    async function fetchUserDetails() {
      if (selectedUser && open) {
        const { data } = await getUserLocationAndClass(selectedUser.id);
        if (data) {
          // set selected values as strings (Select expects string values)
          if (
            data.user_class &&
            data.user_class.length > 0 &&
            data.user_class[0]?.class_id
          ) {
            setSelectedClass(String(data.user_class[0].class_id));
          } else {
            setSelectedClass("");
          }
          if (
            data.user_location &&
            data.user_location.length > 0 &&
            data.user_location[0]?.location_id
          ) {
            setSelectedLocation(String(data.user_location[0].location_id));
          } else {
            setSelectedLocation("");
          }
          // keep role from selectedUser (select is disabled now)
          setSelectedRole(selectedUser.role || "");
          console.log(selectedUser);
        }
      }
    }
    fetchUserDetails();
  }, [selectedUser, open]);

  // Clear temporary state when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedRole("");
      setSelectedClass("");
      setSelectedLocation("");
      setPhoto(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded hover:bg-emerald-100 text-emerald-700 transition"
          title="Edit User"
        >
          <FaUserEdit />
        </button>
      </DialogTrigger>

      {/* modal edit user */}
      <DialogContent className="max-w-80 sm:max-w-[425px] max-h-[95vh] overflow-y-auto text-emerald-700">
        <form
          action={formAction}
          onSubmit={(e) => {
            // validasi -> role wajib dipilih (gunakan nilai terpilih atau nilai user saat ini)
            const roleToSubmit = selectedRole || selectedUser?.role;
            if (!roleToSubmit) {
              e.preventDefault();
              setErrorRole("Pilih role terlebih dahulu");
              return;
            }
            setErrorRole("");
            // Reset form setelah submit
            setTimeout(() => {
              setOpen(false);
              setSelectedRole("");
              setSelectedClass("");
              setSelectedLocation("");
              setPhoto(null);
            }, 500);
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl pb-4">Edit Pengguna</DialogTitle>
          </DialogHeader>

          {/* untuk mengisi id pada formData */}
          <input type="hidden" name="id" value={selectedUser?.id || ""} />

          <div className="grid gap-4">
            {/* input nama */}
            <div className="grid gap-2">
              <Label htmlFor="name-1">Nama</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="Nama Lengkap"
                defaultValue={selectedUser?.name || ""}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Username / NIPD</Label>
              <Input
                id="username"
                name="username"
                placeholder="Username / NIPD"
                defaultValue={selectedUser?.username || ""}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Kosongi jika tidak ingin mengubah password"
              />
            </div>

            {/* select role */}
            <div className="grid gap-2">
              <Label htmlFor="role-selector">Role</Label>
              {/* select disini dimatikan dan tidak berfungsi, hanya menampung nilai role user sebelumnya */}
              <Select disabled defaultValue={selectedUser?.role || ""}>
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
              <input
                type="hidden"
                name="role"
                value={selectedRole || selectedUser?.role || ""}
              />
            </div>

            {/* input kelas & lokasi jika role == pelajar */}
            <AnimatePresence>
              {selectedUser?.role === "pelajar" && (
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
            <ProfilePhotoInput
              value={photo}
              onChange={setPhoto}
              defaultImageUrl={selectedUser?.profile_picture || null}
            />
            {/* input hidden untuk menyertakan current_profile_picture agar masuk formData */}
            <input
              type="hidden"
              name="current_profile_picture"
              value={selectedUser?.profile_picture || null}
            />
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
