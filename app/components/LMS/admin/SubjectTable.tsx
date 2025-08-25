"use client";
import Link from "next/link";
import { FaUserEdit, FaTrashAlt } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

export default function SubjectTable({
  subjects,
  onDelete,
}: {
  subjects: any[];
  onDelete: (subject: any) => void;
}) {
  return (
    <Table>
      <TableCaption>Tabel Mata Pelajaran PKBM Flamboyan</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Mapel</TableHead>
          <TableHead>Tutor yang mengampu</TableHead>
          <TableHead>Dibuat tgl</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects && subjects.length > 0 ? (
          subjects.map((subject, idx) => (
            <TableRow
              key={subject.id}
              className="hover:bg-emerald-50 transition"
            >
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{subject.name}</TableCell>
              <TableCell>Prassetiyo Utomo</TableCell>
              <TableCell>
                {subject.created_at
                  ? new Date(subject.created_at).toLocaleDateString("id-ID")
                  : "-"}
              </TableCell>
              <TableCell className="flex gap-2 justify-end">
                <Link
                  href={`/LMS/admin/MataPelajaran/edit/${subject.id}`}
                  className="p-2 rounded hover:bg-emerald-100 text-emerald-700 transition"
                  title="Edit User"
                >
                  <FaUserEdit />
                </Link>
                <button
                  type="button"
                  className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                  title="Hapus User"
                  onClick={() => onDelete(subject)}
                >
                  <FaTrashAlt />
                </button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              Tidak ada data pengguna.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
