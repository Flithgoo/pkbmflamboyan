import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { FaUserEdit, FaTrashAlt } from "react-icons/fa";

type UserTableProps = {
  users: any[];
  handleDelete: (user: any) => void;
};

export default function UserTable({ users, handleDelete }: UserTableProps) {
  return (
    <Table className="text-xs">
      <TableCaption>Data seluruh pengguna sistem</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Username / NIPD</TableHead>
          <TableHead className="ps-6">Role</TableHead>
          <TableHead>Dibuat tgl</TableHead>
          <TableHead className="text-right pe-7">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users && users.length > 0 ? (
          users.map((user, idx) => (
            <TableRow key={user.id} className="hover:bg-emerald-50 transition">
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10">
                    <Image
                      width={"40"}
                      height={"40"}
                      className="w-full h-full object-cover rounded-full"
                      src={
                        user.profile_picture ||
                        "/assets/placeholder_profile/placeholder_avatar.png"
                      }
                      alt=""
                    />
                  </div>
                  <p className="ml-3">{user.name}</p>
                </div>
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <div
                  className={`px-2 py-1 w-16 text-center rounded text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-gray-100 text-gray-700"
                      : user.role === "tutor"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {user.role}
                </div>
              </TableCell>
              <TableCell>
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("id-ID")
                  : "-"}
              </TableCell>
              <TableCell className="flex text-base gap-2 justify-end">
                <Link
                  href={`/LMS/admin/edit/${user.id}`}
                  className="p-2 rounded hover:bg-emerald-100 text-emerald-700 transition"
                  title="Edit User"
                >
                  <FaUserEdit />
                </Link>
                <button
                  type="button"
                  className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                  title="Hapus User"
                  onClick={() => handleDelete(user)}
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
