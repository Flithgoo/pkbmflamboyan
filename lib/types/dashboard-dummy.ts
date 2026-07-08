// lib/data/dashboard-dummy.ts
//
// Semua data di sini adalah DUMMY DATA.
// Setiap function sengaja dibuat `async` dan mengembalikan `Promise<T>`
// meskipun saat ini hanya me-return object statis. Tujuannya supaya saat
// diganti ke Supabase nanti, pemanggilan di page (Server Component) TIDAK
// perlu diubah sama sekali:
//
//   const data = await getStudentDashboardData(studentId)
//
// cukup ganti isi function ini menjadi:
//
//   const { data, error } = await supabase
//     .from("...")
//     .select("...")
//     .eq("student_id", studentId)
//     .single()
//
// dan mapping hasilnya ke interface yang sama di lib/types/dashboard.ts.

import type {
  StudentDashboardData,
  TutorDashboardData,
  AdminDashboardData,
} from "@/lib/types/dashboard";

export async function getStudentDashboardData(): Promise<StudentDashboardData> {
  return {
    welcome: {
      name: "Ahmad Fauzan",
      role: "pelajar",
      subtitle: "Kelas XI RPL 2",
    },
    stats: [
      {
        id: "total-materi",
        label: "Total Materi",
        value: 24,
        icon: "book-open",
        accent: "emerald",
        helperText: "6 materi baru bulan ini",
      },
      {
        id: "jumlah-tugas",
        label: "Jumlah Tugas",
        value: 8,
        icon: "clipboard-list",
        accent: "amber",
        helperText: "3 belum dikumpulkan",
      },
      {
        id: "kehadiran",
        label: "Persentase Kehadiran",
        value: "92%",
        icon: "user-check",
        accent: "emerald",
        helperText: "Semester berjalan",
      },
      {
        id: "nilai-rata-rata",
        label: "Nilai Rata-rata",
        value: 87,
        icon: "star",
        accent: "amber",
        helperText: "Naik 4 poin",
      },
    ],
    attendanceChart: [
      { month: "Feb", percentage: 88 },
      { month: "Mar", percentage: 90 },
      { month: "Apr", percentage: 85 },
      { month: "Mei", percentage: 94 },
      { month: "Jun", percentage: 91 },
      { month: "Jul", percentage: 92 },
    ],
    recentMateri: [
      {
        id: "m1",
        title: "Struktur Data: Linked List",
        subject: "Pemrograman Dasar",
        createdAt: "2026-07-05",
        type: "Materi",
      },
      {
        id: "m2",
        title: "Tugas Praktikum Query JOIN",
        subject: "Basis Data",
        createdAt: "2026-07-03",
        type: "Tugas",
      },
      {
        id: "m3",
        title: "Pengenalan React Hooks",
        subject: "Pemrograman Web",
        createdAt: "2026-07-01",
        type: "Materi",
      },
      {
        id: "m4",
        title: "Normalisasi Basis Data",
        subject: "Basis Data",
        createdAt: "2026-06-28",
        type: "Materi",
      },
      {
        id: "m5",
        title: "Tugas Membuat ERD Toko Online",
        subject: "Basis Data",
        createdAt: "2026-06-25",
        type: "Tugas",
      },
    ],
    announcements: [
      {
        id: "a1",
        title: "Libur Nasional 17 Agustus",
        content:
          "Kegiatan belajar mengajar diliburkan pada tanggal 17 Agustus.",
        createdAt: "2026-07-06",
        priority: "normal",
      },
      {
        id: "a2",
        title: "Ujian Tengah Semester",
        content:
          "UTS akan dilaksanakan mulai minggu depan, harap persiapkan diri.",
        createdAt: "2026-07-04",
        priority: "penting",
      },
      {
        id: "a3",
        title: "Pengumpulan Tugas Diperpanjang",
        content:
          "Batas pengumpulan tugas Basis Data diperpanjang hingga akhir pekan.",
        createdAt: "2026-07-02",
        priority: "normal",
      },
    ],
  };
}

export async function getTutorDashboardData(): Promise<TutorDashboardData> {
  return {
    welcome: {
      name: "Ibu Siti Nurhaliza, S.Kom",
      role: "tutor",
      subtitle: "Tutor Pemrograman Web & Basis Data",
    },
    stats: [
      {
        id: "jumlah-materi",
        label: "Jumlah Materi",
        value: 42,
        icon: "book-open",
        accent: "emerald",
        helperText: "5 materi bulan ini",
      },
      {
        id: "jumlah-siswa",
        label: "Jumlah Siswa",
        value: 96,
        icon: "users",
        accent: "amber",
        helperText: "Di 3 kelas aktif",
      },
      {
        id: "jumlah-kelas",
        label: "Jumlah Kelas",
        value: 3,
        icon: "layers",
        accent: "emerald",
        helperText: "RPL 1, RPL 2, RPL 3",
      },
      {
        id: "rata-rata-kehadiran",
        label: "Rata-rata Kehadiran",
        value: "89%",
        icon: "user-check",
        accent: "amber",
        helperText: "Seluruh kelas",
      },
    ],
    materiPerBulan: [
      { month: "Feb", total: 4 },
      { month: "Mar", total: 6 },
      { month: "Apr", total: 5 },
      { month: "Mei", total: 8 },
      { month: "Jun", total: 7 },
      { month: "Jul", total: 5 },
    ],
    recentMateri: [
      {
        id: "t1",
        title: "Struktur Data: Linked List",
        subject: "Pemrograman Dasar",
        createdAt: "2026-07-05",
        type: "Materi",
      },
      {
        id: "t2",
        title: "Tugas Praktikum Query JOIN",
        subject: "Basis Data",
        createdAt: "2026-07-03",
        type: "Tugas",
      },
      {
        id: "t3",
        title: "Pengenalan React Hooks",
        subject: "Pemrograman Web",
        createdAt: "2026-07-01",
        type: "Materi",
      },
      {
        id: "t4",
        title: "Normalisasi Basis Data",
        subject: "Basis Data",
        createdAt: "2026-06-28",
        type: "Materi",
      },
      {
        id: "t5",
        title: "Tugas Membuat ERD Toko Online",
        subject: "Basis Data",
        createdAt: "2026-06-25",
        type: "Tugas",
      },
    ],
  };
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  return {
    stats: [
      {
        id: "total-user",
        label: "Total User",
        value: 214,
        icon: "user-cog",
        accent: "emerald",
        helperText: "Seluruh peran",
      },
      {
        id: "siswa",
        label: "Siswa",
        value: 180,
        icon: "graduation-cap",
        accent: "amber",
        helperText: "Aktif semester ini",
      },
      {
        id: "tutor",
        label: "Tutor",
        value: 28,
        icon: "users",
        accent: "emerald",
        helperText: "Di seluruh lokasi",
      },
      {
        id: "materi",
        label: "Materi",
        value: 156,
        icon: "book-open",
        accent: "amber",
        helperText: "Terpublikasi",
      },
    ],
    userDistribution: [
      { role: "Siswa", total: 180 },
      { role: "Tutor", total: 28 },
      { role: "Admin", total: 6 },
    ],
    systemUpdates: [
      {
        id: "s1",
        title: "Pembaruan Sistem Absensi",
        content:
          "Fitur absensi berbasis lokasi telah diperbarui untuk 3 lokasi PKBM.",
        createdAt: "2026-07-06",
        priority: "normal",
      },
      {
        id: "s2",
        title: "Backup Database Terjadwal",
        content: "Backup database bulanan berhasil dilakukan tanpa kendala.",
        createdAt: "2026-07-01",
        priority: "normal",
      },
      {
        id: "s3",
        title: "Penambahan Tutor Baru",
        content:
          "2 tutor baru telah ditambahkan ke sistem untuk lokasi Pondok Gedeg.",
        createdAt: "2026-06-29",
        priority: "penting",
      },
    ],
  };
}
