// lib/api/dashboard/student.ts

import { getAuthContext } from "@/lib/getAuthContext";
import { getUser } from "@/lib/api/user";
import type { StudentDashboardData } from "@/lib/types/dashboard";

export async function getStudentDashboard(): Promise<StudentDashboardData> {
  const { supabase } = await getAuthContext();

  const { data: userData } = await getUser();

  const userId = userData?.id;

  if (!userId) {
    throw new Error("Not authenticated");
  }

  /**
   * Data user
   */
  const { data: userClasses } = await supabase
    .from("user_class")
    .select(
      `
    class_id,
    classes(
      id,
      name
    )
  `,
    )
    .eq("user_id", userId);

  const { data: userLocation } = await supabase
    .from("user_location")
    .select(
      `
    location_id,
    location(
      id,
      name
    )
  `,
    )
    .eq("user_id", userId)
    .single();

  const classIds = userClasses?.map((item) => item.class_id) ?? [];

  const locationId = userLocation?.location_id;
  if (!locationId) {
    throw new Error("Location not found");
  }

  /**
   * Semua materi kelas
   */
  const { data: materials } = await supabase
    .from("material_classes")
    .select(
      `
    materials(
      id,
      title,
      upload_type,
      created_at,
      subjects(
        name
      ),
      material_location(
        location_id
      )
    )
  `,
    )
    .in("class_id", classIds);

  const materialList =
    materials
      ?.map((item) => item.materials)
      .filter(Boolean)
      .filter((material) =>
        material.material_location?.some(
          (loc) => loc.location_id === locationId,
        ),
      ) ?? [];

  /**
   * Filter tipe konten
   */

  const recentMateri = materialList.slice(0, 5).map((item) => ({
    id: String(item.id),
    title: item.title,
    subject: item.subjects?.name ?? "-",
    createdAt: item.created_at,
    type: item.upload_type === "Tugas" ? "Tugas" : "Materi",
  }));

  /**
   * Absensi
   */
  const { data: attendance } = await supabase
    .from("attendances")
    .select(
      `
      status,
      created_at
    `,
    )
    .eq("user_id", userId);

  const totalAttendance = attendance?.length ?? 0;

  const hadir =
    attendance?.filter((item) => item.status === "hadir").length ?? 0;

  const attendancePercentage = totalAttendance
    ? Math.round((hadir / totalAttendance) * 100)
    : 0;

  /**
   * Chart kehadiran per bulan
   */
  const attendanceChart =
    attendance?.reduce(
      (acc, item) => {
        const month = new Date(item.created_at).toLocaleString("id-ID", {
          month: "short",
        });

        const existing = acc.find((x) => x.month === month);

        if (existing) {
          existing.percentage = Math.round((hadir / totalAttendance) * 100);
        } else {
          acc.push({
            month,
            percentage: attendancePercentage,
          });
        }

        return acc;
      },
      [] as {
        month: string;
        percentage: number;
      }[],
    ) ?? [];

  /**
   * Pengumuman
   */
  const announcements = materialList
    .filter((item) => item.upload_type === "Pengumuman")
    .slice(0, 3)
    .map((item) => ({
      id: String(item.id),

      title: item.title,

      content: "",

      createdAt: item.created_at,

      priority: "normal" as const,
    }));

  const totalMaterials = materialList.length;

  const today = new Date().toISOString();

  const { data: activeAssignments } = await supabase
    .from("assignments")
    .select(
      `
    id,
    due_date,
    materials(
      id,
      upload_type,
      material_classes(
        class_id
      )
    )
  `,
    )
    .gte("due_date", today);

  const totalTasks =
    activeAssignments?.filter((assignment) =>
      assignment.materials?.material_classes?.some((item) =>
        classIds.includes(item.class_id),
      ),
    ).length ?? 0;

  return {
    welcome: {
      name: userData.name,
      role: userData.role,
      subtitle: userClasses?.[0]?.classes?.name ?? "",
    },

    stats: [
      {
        id: "total-materi",
        label: "Total Materi",
        value: totalMaterials,
        icon: "book-open",
        accent: "emerald",
        helperText: "Materi tersedia",
      },

      {
        id: "jumlah-tugas",
        label: "Jumlah Tugas",
        value: totalTasks,
        icon: "clipboard-list",
        accent: "amber",
        helperText: "Tugas aktif",
      },

      {
        id: "kehadiran",
        label: "Persentase Kehadiran",
        value: `${attendancePercentage}%`,
        icon: "user-check",
        accent: "emerald",
        helperText: "Semester berjalan",
      },

      {
        id: "aktivitas",
        label: "Total Aktivitas",
        value: materialList.length,
        icon: "star",
        accent: "amber",
        helperText: "Materi dan tugas",
      },
    ],

    attendanceChart,

    recentMateri,

    announcements,
  };
}
