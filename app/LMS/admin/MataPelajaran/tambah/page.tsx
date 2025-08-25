import { addUserAction } from "@/lib/actions/user";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function AddSubjectPage() {
  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gradient-to-br py-5 from-emerald-50 to-amber-50">
      <form
        action={addUserAction}
        method="POST"
        className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-emerald-700">
          Tambah Mata Pelajaran
        </h1>
        <div className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="Nama Mapel"
            required
            className="border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
          />
          <input
            name="description"
            type="textarea"
            placeholder="deskripsi"
            required
            className="border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
          />

          <p className="text-xs text-gray-400 mt-1">
            Format: JPG, JPEG, PNG, maksimal 2MB. Kosongkan jika tidak ingin
            mengubah foto.
          </p>

          <button
            type="submit"
            className="bg-emerald-600 text-white rounded-lg px-4 py-2 font-semibold w-full hover:bg-emerald-700 transition"
          >
            Simpan
          </button>
          <Link
            href="/LMS/admin"
            className="flex items-center justify-center gap-2 mt-2 text-emerald-700 hover:text-emerald-900 font-semibold transition"
          >
            <FaArrowLeft />
            Kembali ke Admin
          </Link>
        </div>
      </form>
    </div>
  );
}
