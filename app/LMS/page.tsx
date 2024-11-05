import React from "react";
import SideNav from "../components/LMS/Sidenav";

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SideNav />
      <main>{children}</main>
    </div>
  );
};

export default Dashboard;
