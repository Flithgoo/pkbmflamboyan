import React from "react";
import AdminSidebar from "@/app/components/LMS/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex flex-grow bg-gradient-to-br py-5 from-emerald-50 to-amber-50">
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
