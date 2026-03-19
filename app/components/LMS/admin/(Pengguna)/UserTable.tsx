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
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import EditUserDialog from "./EditUserDialog";

type UserTableProps = {
  users: any[];
  selectedUser: any | null;
  handleEdit: (formData: FormData) => Promise<void>;
  handleDelete: (user: any) => void;
};

export default function UserTable({
  users,
  handleEdit,
  handleDelete,
}: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "name" | "username" | "role" | "created_at"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(10);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "created_at") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages =
    pageSize === "all"
      ? 1
      : Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const paginatedUsers =
    pageSize === "all"
      ? sortedUsers
      : sortedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (column: "name" | "username" | "role" | "created_at") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageSizeChange = (size: number | "all") => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-4">
      <div className="mb-4 flex flex-wrap gap-3 items-center bg-emerald-50/80 p-3 rounded-lg border border-emerald-100">
        <div className="flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Cari nama atau username..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(
              e.target.value as "name" | "username" | "role" | "created_at",
            );
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="name">Urutkan berdasarkan Nama</option>
          <option value="username">Urutkan berdasarkan Username</option>
          <option value="role">Urutkan berdasarkan Role</option>
          <option value="created_at">Urutkan berdasarkan Tanggal Dibuat</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>
        <select
          value={pageSize}
          onChange={(e) =>
            handlePageSizeChange(
              e.target.value === "all" ? "all" : Number(e.target.value),
            )
          }
          className="px-3 py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value={10}>10 per halaman</option>
          <option value={25}>25 per halaman</option>
          <option value={50}>50 per halaman</option>
          <option value={100}>100 per halaman</option>
          <option value="all">Semua</option>
        </select>
        <p className="text-sm text-slate-600">
          Menampilkan {paginatedUsers.length} dari {sortedUsers.length} pengguna
        </p>
      </div>
      <Table className="text-xs">
        <TableCaption>Data seluruh pengguna sistem</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead
              onClick={() => handleSort("name")}
              className="cursor-pointer"
            >
              Nama {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              onClick={() => handleSort("username")}
              className="cursor-pointer"
            >
              Username / NIPD{" "}
              {sortBy === "username" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              onClick={() => handleSort("role")}
              className="cursor-pointer ps-6"
            >
              Role {sortBy === "role" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              onClick={() => handleSort("created_at")}
              className="cursor-pointer"
            >
              Dibuat tgl{" "}
              {sortBy === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="text-right pe-7">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers && paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, idx) => (
              <TableRow
                key={user.id}
                className="hover:bg-emerald-50 transition"
              >
                <TableCell>
                  {(pageSize === "all"
                    ? 0
                    : (currentPage - 1) * Number(pageSize)) +
                    idx +
                    1}
                </TableCell>
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
                  <EditUserDialog
                    selectedUser={user}
                    formAction={handleEdit}
                    isLoading={false}
                  />
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-slate-600">
          Halaman {currentPage} dari {totalPages} ({sortedUsers.length}{" "}
          pengguna)
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 rounded border border-emerald-300 bg-white text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 rounded border border-emerald-300 bg-white text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
