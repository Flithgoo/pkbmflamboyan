import React from "react";
import SideNav from "../../components/LMS/Sidenav";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-lg md:rounded-r-3xl flex-none">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-emerald-100">
            <span className="text-2xl font-bold text-emerald-600 tracking-tight">
              Halaman Tutor
            </span>
          </div>
          <nav className="flex-1 p-4">
            <SideNav />
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-transparent flex flex-col">
        <div className="w-full max-w-5xl mx-auto flex-1">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
