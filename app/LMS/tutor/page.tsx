import { WelcomeCard } from "@/app/components/LMS/dashboard/WelcomeCard";
import { StatCardGrid } from "@/app/components/LMS/dashboard/StatCard";
import { MateriPerBulanChart } from "@/app/components/LMS/dashboard/MateriPerBulanChart";
import { RecentMateriList } from "@/app/components/LMS/dashboard/RecentMateriList";
import { getTutorDashboardData } from "@/lib/types/dashboard-dummy";
import { getTutorDashboard } from "@/lib/api/dashboard/tutor";

export default async function TutorDashboardPage() {
  const data = await getTutorDashboard();

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <WelcomeCard welcome={data.welcome} />

      <StatCardGrid stats={data.stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MateriPerBulanChart data={data.materiPerBulan} />
        </div>
        <div className="lg:col-span-1">
          <RecentMateriList items={data.recentMateri} title="Materi Terbaru" />
        </div>
      </div>
    </div>
  );
}
