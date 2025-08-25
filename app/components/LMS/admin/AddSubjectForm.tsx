// components/LMS/admin/AddSubjectForm.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { addSubjectAction } from "@/lib/actions/subject";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default async function AddSubjectForm() {
  return (
    <DialogContent className="sm:max-w-[425px] text-emerald-700">
      <DialogHeader>
        <DialogTitle className="text-xl">Tambah Mata Pelajaran</DialogTitle>
      </DialogHeader>
      <form action={addSubjectAction} className="grid gap-4">
        <div className="grid gap-3">
          <label htmlFor="name-1">Nama</label>
          <Input id="name-1" name="name" placeholder="Nama Mapel" />
        </div>
        <Select name="tutor">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih tutor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <DialogFooter>
          <button
            type="submit"
            className="bg-emerald-600 text-white rounded-lg px-4 py-2 font-semibold w-full hover:bg-emerald-700 transition"
          >
            Simpan
          </button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
