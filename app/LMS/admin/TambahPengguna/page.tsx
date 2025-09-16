import { addUserAction } from "@/lib/actions/user";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function AddUserPage() {
  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gradient-to-br py-5 from-emerald-50 to-amber-50">
      <form
        action={addUserAction}
        className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-emerald-700">
          Tambah Pengguna
        </h1>
        <div className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="Nama Lengkap"
            required
            className="border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
          />
          <input
            name="username"
            type="text"
            placeholder="Username/NIPD"
            required
            className="border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
          />
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Role
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  required
                  className="accent-emerald-600"
                />
                <span className="text-gray-700">Admin</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="tutor"
                  required
                  className="accent-emerald-600"
                />
                <span className="text-gray-700">Tutor</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="pelajar"
                  required
                  className="accent-emerald-600"
                />
                <span className="text-gray-700">Pelajar</span>
              </label>
            </div>
          </div>
          <input
            name="profile_picture"
            type="file"
            accept="image/*"
            placeholder="URL Foto Profil (opsional)"
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
