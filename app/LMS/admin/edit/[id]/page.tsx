import { editUserAction } from "@/lib/actions/user";
import { getUserById } from "@/lib/api/user";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import ProfilePicturePreview from "@/app/components/LMS/admin/ProfilePicturePreview";

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: user, error } = await getUserById(Number(params.id));

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            User tidak ditemukan
          </h2>
          <Link
            href="/LMS/admin"
            className="inline-flex items-center gap-2 mt-4 text-emerald-600 hover:text-emerald-800 font-semibold"
          >
            <FaArrowLeft />
            Kembali ke Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gradient-to-br py-5 from-emerald-50 to-amber-50">
      <form
        action={editUserAction}
        className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-emerald-700">
          Edit Pengguna
        </h1>
        <div className="flex flex-col gap-4">
          {/* Preview Foto Profil Saat Ini */}
          <div className="flex flex-col items-center mb-4">
            <label className="block mb-2 font-semibold text-gray-700">
              Foto Profil Saat Ini
            </label>
            <ProfilePicturePreview
              profilePictureUrl={user.profile_picture ?? undefined}
              altText="Foto Profil"
            />
          </div>

          <input
            name="name"
            type="text"
            defaultValue={user.name}
            placeholder="Nama Lengkap"
            required
            className="border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
          />
          <input
            name="username"
            type="text"
            defaultValue={user.username}
            placeholder="Username/NIPD"
            required
            className="border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (kosongkan jika tidak ingin mengubah)"
            className="border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
            autoComplete="new-password"
          />
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Role
            </label>
            <select
              name="role"
              defaultValue={user.role}
              required
              className="border border-emerald-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">Pilih Role</option>
              <option value="admin">Admin</option>
              <option value="tutor">Tutor</option>
              <option value="pelajar">Pelajar</option>
            </select>
          </div>

          {/* Upload Foto Profil Baru */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Ganti Foto Profil (Opsional)
            </label>
            <input
              name="profile_picture"
              type="file"
              accept="image/*"
              className="border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: JPG, JPEG, PNG, maksimal 2MB. Kosongkan jika tidak ingin
              mengubah foto.
            </p>
          </div>

          {/* Hidden input untuk menyimpan URL foto lama */}
          <input
            type="hidden"
            name="current_profile_picture"
            value={user.profile_picture || ""}
          />
          <input type="hidden" name="id" value={user.id} />

          <button
            type="submit"
            className="bg-emerald-600 text-white rounded-lg px-4 py-2 font-semibold w-full hover:bg-emerald-700 transition"
          >
            Simpan Perubahan
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
