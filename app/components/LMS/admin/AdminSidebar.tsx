"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { HiMenuAlt2 } from "react-icons/hi";
import { logoutAction } from "@/lib/actions/logout";
import { adminDashboardLinks, tutorDashboardLinks } from "@/app/utils/data";
import Logo from "../../ui/Logo";

export default function AdminSidebar() {
  const { toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();

  let menuItems;
  let path;
  if (pathname.startsWith("/LMS/admin")) {
    menuItems = adminDashboardLinks;
    path = "/LMS/admin";
  } else {
    menuItems = tutorDashboardLinks;
    path = "/LMS/tutor";
  }

  return (
    <>
      <Sidebar>
        <aside className="relative flex flex-col h-screen bg-slate-50 text-emerald-600 shadow-lg">
          {/* Toggle Button */}
          <HiMenuAlt2
            role="button"
            className="absolute text-emerald-600 top-2 -right-8 w-8 h-8"
            onClick={() => {
              toggleSidebar();
            }}
          />

          {/* Logo */}
          <SidebarHeader className="border-b border-emerald-600/20 pt-3 ">
            <div className="flex items-center justify-start px-4 py-3">
              <Logo />
            </div>
          </SidebarHeader>

          {/* Menu */}
          <SidebarContent className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== path && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (isMobile) {
                      toggleSidebar();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amber-500/80 text-white shadow"
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
          <SidebarFooter className="p-4 border-t border-emerald-600/20">
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-red-600 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </form>
          </SidebarFooter>
        </aside>
      </Sidebar>
      {isMobile && (
        <HiMenuAlt2
          role="button"
          className="fixed text-emerald-600 top-2 left-2 mb-10 w-8 h-8"
          onClick={() => {
            toggleSidebar();
          }}
        />
      )}
    </>
  );
}
