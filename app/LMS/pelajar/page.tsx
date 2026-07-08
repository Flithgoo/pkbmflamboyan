import { WelcomeCard } from "@/app/components/LMS/dashboard/WelcomeCard";
import { StatCardGrid } from "@/app/components/LMS/dashboard/StatCard";
import { AttendanceChart } from "@/app/components/LMS/dashboard/AttendanceChart";
import { RecentMateriList } from "@/app/components/LMS/dashboard/RecentMateriList";
import { AnnouncementList } from "@/app/components/LMS/dashboard/AnnouncementList";
import { getStudentDashboardData } from "@/lib/types/dashboard-dummy";

// Server Component: fetch data langsung dengan `await`.
// Saat dashboard-dummy.ts diganti ke Supabase, halaman ini tidak perlu diubah.
export default async function StudentDashboardPage() {
  const data = await getStudentDashboardData();

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <WelcomeCard welcome={data.welcome} />

      <StatCardGrid stats={data.stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceChart data={data.attendanceChart} />
        </div>
        <div className="lg:col-span-1">
          <AnnouncementList items={data.announcements} />
        </div>
      </div>

      <RecentMateriList items={data.recentMateri} title="5 Materi Terbaru" />
    </div>
  );
}
