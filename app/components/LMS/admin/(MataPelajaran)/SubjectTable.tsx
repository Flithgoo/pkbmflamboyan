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
  tutorSubjects,
  onDelete,
  onEdit,
}: {
  tutorSubjects: any[];
  onDelete: (subject: any) => void;
  onEdit: (subject: any) => void;
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
        {tutorSubjects && tutorSubjects.length > 0 ? (
          tutorSubjects.map((subject, idx) => {
            // kalau tidak ada tutor
            if (subject.tutor_subjects.length === 0) {
              return (
                <TableRow
                  key={subject.id}
                  className="hover:bg-emerald-50 transition"
                >
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    {subject.created_at
                      ? new Date(subject.created_at).toLocaleDateString("id-ID")
                      : "-"}
                  </TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <Link
                      href={`/LMS/admin/MataPelajaran/edit/${subject.id}`}
                      className="p-2 rounded hover:bg-emerald-100 text-emerald-700 transition"
                      title="Edit Mapel"
                    >
                      <FaUserEdit />
                    </Link>
                    <button
                      type="button"
                      className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                      title="Hapus Mapel"
                      onClick={() => onDelete(tutorSubjects)}
                    >
                      <FaTrashAlt />
                    </button>
                  </TableCell>
                </TableRow>
              );
            }

            // kalau ada tutor (bisa lebih dari 1)
            return subject.tutor_subjects.map(
              (tutor: any, tutorIdx: number) => (
                <TableRow
                  key={`${subject.id}-${tutorIdx}`}
                  className="hover:bg-emerald-50 transition"
                >
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{tutor.users?.name ?? "-"}</TableCell>
                  <TableCell>
                    {subject.created_at
                      ? new Date(subject.created_at).toLocaleDateString("id-ID")
                      : "-"}
                  </TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <button
                      type="button"
                      className="p-2 rounded hover:bg-emerald-100 text-emerald-700 transition"
                      title="Edit Mapel"
                      onClick={() => onEdit(subject)}
                    >
                      <FaUserEdit />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                      title="Hapus Mapel"
                      onClick={() => onDelete(subject)}
                    >
                      <FaTrashAlt />
                    </button>
                  </TableCell>
                </TableRow>
              )
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              Tidak ada data mata pelajaran.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
