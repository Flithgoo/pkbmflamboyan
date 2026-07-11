import { StatCardGrid } from "@components/LMS/dashboard/StatCard";
import { UserDistributionChart } from "@components/LMS/dashboard/UserDistributionChart";
import { AnnouncementList } from "@components/LMS/dashboard/AnnouncementList";
import { getAdminDashboardData } from "@/lib/types/dashboard-dummy";
import { getAdminDashboard } from "@/lib/api/dashboard/admin";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Dashboard Admin
        </h1>
        <p className="text-sm text-slate-500">
          Ringkasan sistem PKBM Flamboyan
        </p>
      </div>

      <StatCardGrid stats={data.stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <UserDistributionChart data={data.userDistribution} />
        </div>
        <div className="lg:col-span-2">
          <AnnouncementList
            items={data.systemUpdates}
            title="Pengumuman terakhir"
          />
        </div>
      </div>
    </div>
  );
}
