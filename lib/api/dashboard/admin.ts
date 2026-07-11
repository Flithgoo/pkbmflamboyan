import { getAuthContext } from "@/lib/getAuthContext";

export async function getAdminDashboard() {
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
      .eq("role", "student"),

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

  const { data: roles } = await supabase.from("users").select("role");

  const roleChart =
    roles?.reduce(
      (acc, item) => {
        acc[item.role] = (acc[item.role] ?? 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    ) ?? {};

  return {
    data: {
      stats: {
        users: users.count ?? 0,
        students: students.count ?? 0,
        tutors: tutors.count ?? 0,
        materials: materials.count ?? 0,
      },

      roleChart: Object.entries(roleChart).map(([name, value]) => ({
        name,
        value,
      })),
    },

    error: null,
  };
}
