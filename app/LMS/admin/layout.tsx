import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/app/components/LMS/LMSSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex flex-grow bg-gradient-to-br py-5 from-emerald-50 to-amber-50">
        {children}
      </main>
    </SidebarProvider>
  );
}
