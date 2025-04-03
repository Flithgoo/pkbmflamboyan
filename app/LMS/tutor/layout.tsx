import React from "react";
import SideNav from "../../components/LMS/Sidenav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-slate-200 flex min-h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-4 md:overflow-y-auto md:p-4">{children}</div>
    </div>
  );
};

export default Layout;
