import React from "react";
import { supabase } from "@utils/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = async () => {
  const { data, error } = await supabase
    .from("tutor")
    .select("foto_profil")
    .eq("id", 1);
  console.log(data);

  if (error) return <p>Error: {error.message}</p>;
  const { foto_profil } = data[0];

  return (
    <main>
      <div className="h-96 bg-white rounded-md p-5">
        <div className="flex justify-between">
          <h1 className="font-bold text-xl m-1">Dashboard</h1>
          <div className="flex">
            <div className="flex me-4 mt-2 flex-col text-end">
              <p className="text-slate-800 text-sm font-semibold">
                Prassetiyo Utomo
              </p>
              <p className="text-slate-500 text-xs font-semibold">Tutor TIK</p>
            </div>
            <Avatar className="w-14 h-14">
              <AvatarImage src={foto_profil} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
