import React from "react";
import { redirect } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import SideNav from "../../components/LMS/Sidenav";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  async function getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;

      if (!user) {
        return { authenticated: false };
      }

      // Dapatkan data profil
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      return {
        authenticated: true,
        user,
        profile: profileData,
      };
    } catch (error) {
      console.error("Error mendapatkan user:", (error as Error).message);
      return { authenticated: false, error: (error as Error).message };
    }
  }

  const { user } = await getCurrentUser();
  console.log(user + "cek");
  return (
    <div className="flex min-h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-4 md:overflow-y-auto md:p-4">{children}</div>
    </div>
  );
};

export default Layout;
