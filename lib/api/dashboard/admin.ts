// lib/api/dashboard/admin.ts

import { getAuthContext } from "@/lib/getAuthContext";
import type { AdminDashboardData } from "@/lib/types/dashboard";

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const { supabase } = await getAuthContext();

  const [users, students, tutors, materials] = await Promise.all([
    supabase.from("users").select("id", {
      count: "exact",
      head: true,
    }),

    supabase
      .from("users")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("role", "pelajar"),

    supabase
      .from("users")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("role", "tutor"),

    supabase.from("materials").select("id", {
      count: "exact",
      head: true,
    }),
  ]);

  /**
   * Distribusi role user
   */
  const { data: roles } = await supabase.from("users").select("role");

  const roleDistribution =
    roles?.reduce(
      (acc, item) => {
        acc[item.role] = (acc[item.role] ?? 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    ) ?? {};

  /**
   * Pengumuman terbaru sistem
   * Menggunakan materials.upload_type
   */
  const { data: announcements } = await supabase
    .from("materials")
    .select(
      `
      id,
      title,
      content,
      created_at
    `,
    )
    .eq("upload_type", "Pengumuman")
    .order("created_at", {
      ascending: false,
    })
    .limit(3);

  return {
    stats: [
      {
        id: "total-user",
        label: "Total User",
        value: users.count ?? 0,
        icon: "user-cog",
        accent: "emerald",
        helperText: "Seluruh pengguna",
      },

      {
        id: "pelajar",
        label: "Pelajar",
        value: students.count ?? 0,
        icon: "graduation-cap",
        accent: "amber",
        helperText: "Aktif terdaftar",
      },

      {
        id: "tutor",
        label: "Tutor",
        value: tutors.count ?? 0,
        icon: "users",
        accent: "emerald",
        helperText: "Pengajar aktif",
      },

      {
        id: "materi",
        label: "Materi",
        value: materials.count ?? 0,
        icon: "book-open",
        accent: "amber",
        helperText: "Terpublikasi",
      },
    ],

    userDistribution: Object.entries(roleDistribution).map(([role, total]) => ({
      role,

      total,
    })),

    systemUpdates:
      announcements?.map((item) => ({
        id: String(item.id),

        title: item.title,

        content: item.content ?? "",

        createdAt: item.created_at,

        priority: "normal" as const,
      })) ?? [],
  };
}
