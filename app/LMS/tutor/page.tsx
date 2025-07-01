import React from "react";
import { createSupabaseServerClient } from "@utils/supabase-server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

const Dashboard = async () => {
  const supabase = createSupabaseServerClient();

  // Fetch user data from Supabase
  const token = cookies().get("token")?.value;

  let user = null; // Initialize user as null
  if (token) {
    try {
      user = await verifyJwt(token); // user = { id, email, role }
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  const { data, error } = await supabase
    .from("users")
    .select("profile_picture, name, role")
    .eq("id", user?.id)
    .single();

  if (error)
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500 font-medium">{error.message}</p>
      </main>
    );

  const { profile_picture, name, role } = data;

  return (
    <main className="flex flex-col gap-8 items-center justify-center min-h-[60vh] px-4">
      <section className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar className="w-20 h-20 shadow-md">
          <AvatarImage
            src={profile_picture || undefined}
            alt={name || "Tutor"}
          />
          <AvatarFallback>
            {name
              ? name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
              : "Error"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {name || "Nama Tutor"}
          </h1>
          <p className="text-emerald-600 font-semibold capitalize">
            {role || "Tutor"}
          </p>
          <p className="text-gray-500 mt-2">
            Selamat datang di dashboard tutor. Kelola materi, tugas, dan pantau
            perkembangan pelajar Anda di sini.
          </p>
        </div>
      </section>

      <section className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 rounded-xl p-5 shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-emerald-700 mb-2">
            Materi
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Kelola dan unggah materi pembelajaran untuk pelajar.
          </p>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">
            Lihat Materi
          </button>
        </div>
        <div className="bg-amber-50 rounded-xl p-5 shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-amber-700 mb-2">Tugas</h2>
          <p className="text-gray-600 text-sm mb-4">
            Buat dan pantau tugas yang diberikan kepada pelajar.
          </p>
          <button className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition">
            Lihat Tugas
          </button>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
