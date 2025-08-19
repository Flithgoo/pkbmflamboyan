"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  BookOpen,
  Users,
  Settings,
  LogOut,
  BarChart2,
  UserPlus,
  UserCog,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { name: "Dashboard", icon: Home, href: "/LMS/admin" },
  { name: "Pengguna", icon: Users, href: "/LMS/admin#daftar-pengguna" },
  {
    name: "Tambah Pengguna",
    icon: UserPlus,
    href: "/LMS/admin/TambahPengguna",
  },
  { name: "Materi & Kelas", icon: BookOpen, href: "/LMS/admin/kelas" },
  { name: "Laporan", icon: BarChart2, href: "/LMS/admin/laporan" },
  { name: "Pengaturan", icon: Settings, href: "/LMS/admin/settings" },
];

export default function AdminSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar>
      <aside className="relative flex flex-col h-screen bg-emerald-600 text-white shadow-lg">
        {/* Toggle Button */}
        <SidebarTrigger className="absolute text-slate-800 top-4 -right-7" />

        {/* Logo */}
        <SidebarHeader className="border-b border-white/20 text-center pt-3 text-xl font-bold tracking-wide">
          PKBM Flamboyan
        </SidebarHeader>

        {/* Menu */}
        <SidebarContent className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/LMS/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-amber-400/90 text-white shadow"
                    : "hover:bg-emerald-500 hover:text-white/90"
                )}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </SidebarContent>

        {/* Logout */}
        <SidebarFooter className="p-4 border-t border-white/20">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-red-600 transition">
            <LogOut size={18} />
            Logout
          </button>
        </SidebarFooter>
      </aside>
    </Sidebar>
  );
}
