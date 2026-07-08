// lib/types/dashboard.ts
// Semua interface dashboard didefinisikan di sini agar konsisten antara
// dummy data (sekarang) dan hasil query Supabase (nanti).
// Prinsip: shape data TIDAK boleh berubah saat pindah dari dummy -> Supabase,
// yang berubah hanya isi function di lib/data/*.ts (dari return object statis
// menjadi hasil `await supabase.from(...).select(...)`).

export type UserRole = "pelajar" | "tutor" | "admin";

/** Kunci ikon Lucide yang didukung oleh <StatCard />. Disimpan sebagai string
 *  (bukan komponen React) supaya data tetap serializable / aman untuk hasil
 *  query database atau JSON API di masa depan. */
export type StatIconKey =
  | "book-open"
  | "clipboard-list"
  | "user-check"
  | "star"
  | "users"
  | "graduation-cap"
  | "layers"
  | "trending-up"
  | "megaphone"
  | "user-cog";

export type StatAccent = "emerald" | "amber";

export interface WelcomeInfo {
  name: string;
  role: UserRole;
  /** Contoh: "Kelas XI RPL 2" (khusus siswa) */
  subtitle?: string;
}

export interface StatCardData {
  id: string;
  label: string;
  value: string | number;
  icon: StatIconKey;
  accent?: StatAccent;
  /** Contoh: "+2 dari bulan lalu" */
  helperText?: string;
}

export interface AttendanceMonthly {
  month: string;
  percentage: number;
}

export interface MateriPerBulan {
  month: string;
  total: number;
}

export interface UserDistributionSlice {
  role: string;
  total: number;
}

export interface MateriItem {
  id: string;
  title: string;
  subject: string;
  createdAt: string; // ISO date string
  type: "Materi" | "Tugas";
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  priority: "normal" | "penting";
}

export interface StudentDashboardData {
  welcome: WelcomeInfo;
  stats: StatCardData[];
  attendanceChart: AttendanceMonthly[];
  recentMateri: MateriItem[];
  announcements: AnnouncementItem[];
}

export interface TutorDashboardData {
  welcome: WelcomeInfo;
  stats: StatCardData[];
  materiPerBulan: MateriPerBulan[];
  recentMateri: MateriItem[];
}

export interface AdminDashboardData {
  stats: StatCardData[];
  userDistribution: UserDistributionSlice[];
  systemUpdates: AnnouncementItem[];
}
