import { AssignmentMaterial, StatsData } from "@/lib/types/assignment";

/**
 * Get progress bar color class based on progress percentage
 */
export function getProgressColor(progress: number): string {
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 50) return "bg-amber-500";
  return "bg-red-500";
}

/**
 * Get progress label color class based on progress percentage
 */
export function getProgressLabel(progress: number): string {
  if (progress >= 80) return "text-emerald-600";
  if (progress >= 50) return "text-amber-600";
  return "text-red-600";
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date to short format (e.g., "20 Jun 2026")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Calculate statistics from assignments
 */
export function calculateStats(assignments: AssignmentMaterial[]): StatsData {
  return {
    // jumlah tugas
    totalAssignments: assignments.length,

    // jumlah siswa target terbesar
    totalStudents: assignments.length
      ? Math.max(...assignments.map((a) => a.total_students))
      : 0,

    // total submission yang sudah diberi nilai
    gradedCount: assignments.reduce((sum, a) => sum + a.total_graded, 0),

    // total submission yang belum diberi nilai
    notGradedCount: assignments.reduce((sum, a) => sum + a.total_not_graded, 0),
  };
}

/**
 * Filter assignments by search query
 */
export function filterBySearch(
  assignments: AssignmentMaterial[],
  query: string,
): AssignmentMaterial[] {
  if (!query.trim()) return assignments;
  return assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(query.toLowerCase()),
  );
}

/**
 * Filter assignments by subject
 */
export function filterBySubject(
  assignments: AssignmentMaterial[],
  subject: string,
): AssignmentMaterial[] {
  if (subject === "all") return assignments;
  return assignments.filter(
    (assignment) => assignment.subject_name === subject,
  );
}

/**
 * Sort assignments
 */
export function sortAssignments(
  assignments: AssignmentMaterial[],
  sortBy: string,
): AssignmentMaterial[] {
  const sorted = [...assignments];

  switch (sortBy) {
    case "oldest":
      sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      break;
    case "progress_high":
      sorted.sort((a, b) => b.progress - a.progress);
      break;
    case "progress_low":
      sorted.sort((a, b) => a.progress - b.progress);
      break;
    case "latest":
    default:
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      break;
  }

  return sorted;
}

/**
 * Get unique subjects from assignments
 */
export function getUniqueSubjects(assignments: AssignmentMaterial[]): string[] {
  return Array.from(new Set(assignments.map((a) => a.subject_name)));
}
