import {
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

export default function BantuanPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Panduan Penggunaan LMS
        </h1>

        <p className="mt-2 text-gray-600">
          Halaman ini berisi panduan singkat mengenai penggunaan aplikasi
          E-Learning PKBM Flamboyan.
        </p>
      </div>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <LightBulbIcon className="h-6 w-6 text-amber-500" />
          Langkah Awal
        </h2>

        <ol className="list-decimal space-y-2 pl-6 text-gray-700">
          <li>Masuk menggunakan akun yang diberikan admin.</li>
          <li>Lengkapi foto profil dan data diri.</li>
          <li>Ganti password agar akun lebih aman.</li>
        </ol>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <BookOpenIcon className="mb-3 h-8 w-8 text-emerald-600" />

          <h3 className="font-semibold text-lg">Materi</h3>

          <p className="mt-2 text-sm text-gray-600">
            Buka menu Materi untuk melihat seluruh materi pembelajaran sesuai
            kelas Anda.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <ClipboardDocumentListIcon className="mb-3 h-8 w-8 text-blue-600" />

          <h3 className="font-semibold text-lg">Tugas</h3>

          <p className="mt-2 text-sm text-gray-600">
            Kerjakan tugas sebelum batas waktu yang ditentukan.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <CalendarDaysIcon className="mb-3 h-8 w-8 text-orange-600" />

          <h3 className="font-semibold text-lg">Absensi</h3>

          <p className="mt-2 text-sm text-gray-600">
            Lakukan absensi saat tersedia. Absensi hanya dapat dilakukan pada
            waktu yang ditentukan tutor.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <ChatBubbleLeftRightIcon className="mb-3 h-8 w-8 text-purple-600" />

          <h3 className="font-semibold text-lg">Komentar</h3>

          <p className="mt-2 text-sm text-gray-600">
            Gunakan komentar untuk berdiskusi mengenai materi dengan tutor.
          </p>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <UserCircleIcon className="h-6 w-6 text-emerald-600" />
          Tips Penggunaan
        </h2>

        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          <li>Gunakan browser terbaru.</li>
          <li>Jangan membagikan password kepada orang lain.</li>
          <li>Logout setelah selesai menggunakan aplikasi.</li>
          <li>Pastikan koneksi internet stabil saat mengerjakan tugas.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="font-semibold text-emerald-700">
          Masih mengalami kendala?
        </h2>

        <p className="mt-2 text-sm text-emerald-700">
          Silakan hubungi Admin atau Tutor PKBM Flamboyan untuk mendapatkan
          bantuan lebih lanjut.
        </p>
      </section>
    </div>
  );
}
