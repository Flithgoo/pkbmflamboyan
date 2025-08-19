import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Adminsidebar from "@components/LMS/admin/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Adminsidebar />
      <main className="flex flex-grow bg-gradient-to-br py-5 from-emerald-50 to-amber-50">
        {children}
      </main>
    </SidebarProvider>
  );
}
