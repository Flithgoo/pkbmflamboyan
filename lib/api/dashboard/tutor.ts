// lib/api/dashboard/tutor.ts

import { getAuthContext } from "@/lib/getAuthContext";
import type { TutorDashboardData } from "@/lib/types/dashboard";
import { getUser } from "@/lib/api/user";

export async function getTutorDashboard(): Promise<TutorDashboardData> {
  const { supabase } = await getAuthContext();

  const { data: userData } = await getUser();

  const userId = userData?.id;

  if (!userId) {
    throw new Error("Not authenticated");
  }

  /**
   * Total materi tutor
   */
  const { count: materialCount } = await supabase
    .from("materials")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId)
    .in("upload_type", ["Tugas", "Materi"]);

  /**
   * Materi bulan ini
   */
  const { data: materials } = await supabase
    .from("materials")
    .select(
      `
    id,
    title,
    created_at,
    upload_type,
    subjects(
      name
    )
  `,
    )
    .eq("user_id", userId)
    .in("upload_type", ["Tugas", "Materi"])
    .order("created_at", {
      ascending: false,
    });

  /**
   * Jumlah kelas dari material_classes
   */
  const { data: materialClasses } = await supabase
    .from("material_classes")
    .select(
      `
      class_id,
      materials!inner(
        user_id
      )
    `,
    )
    .eq("materials.user_id", userId);

  const totalClasses = new Set(materialClasses?.map((item) => item.class_id))
    .size;

  /**
   * Materi per bulan untuk chart
   */
  const materiPerBulan =
    materials?.reduce(
      (acc, item) => {
        const month = new Date(item.created_at).toLocaleString("id-ID", {
          month: "short",
        });

        const existing = acc.find((x) => x.month === month);

        if (existing) {
          existing.total++;
        } else {
          acc.push({
            month,
            total: 1,
          });
        }

        return acc;
      },
      [] as {
        month: string;
        total: number;
      }[],
    ) ?? [];

  /**
   * Ambil 5 materi terakhir
   */
  const recentMateri =
    materials?.slice(0, 5).map((item) => {
      const type: "Tugas" | "Materi" | "Pengumuman" =
        item.upload_type === "Tugas"
          ? "Tugas"
          : item.upload_type === "Materi"
            ? "Materi"
            : "Pengumuman";

      return {
        id: String(item.id),
        title: item.title,
        subject: item.subjects?.name ?? "-",
        createdAt: item.created_at,
        type,
      };
    }) ?? [];

  return {
    welcome: {
      name: userData.name,
      role: userData.role,
      subtitle: userData.username,
    },

    stats: [
      {
        id: "jumlah-materi",
        label: "Jumlah Materi",
        value: materialCount ?? 0,
        icon: "book-open",
        accent: "emerald",
        helperText: "Materi yang dibuat",
      },

      {
        id: "jumlah-siswa",
        label: "Jumlah Siswa",
        value: 0,
        icon: "users",
        accent: "amber",
        helperText: "Siswa aktif",
      },

      {
        id: "jumlah-kelas",
        label: "Jumlah Kelas",
        value: totalClasses,
        icon: "layers",
        accent: "emerald",
        helperText: "Kelas yang diajar",
      },

      {
        id: "tugas",
        label: "Tugas",
        value:
          materials?.filter((item) => item.upload_type === "Tugas").length ?? 0,
        icon: "clipboard-list",
        accent: "amber",
        helperText: "Tugas dibuat",
      },
    ],

    materiPerBulan,

    recentMateri,
  };
}
