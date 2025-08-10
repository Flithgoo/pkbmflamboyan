import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@components/LMS/admin/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex flex-grow bg-gradient-to-br py-5 from-emerald-50 to-amber-50">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
