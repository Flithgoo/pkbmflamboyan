export interface AssignmentMaterial {
  material_id: number;
  title: string;
  created_at: string;

  subject_id: number;
  subject_name: string;

  total_students: number;
  total_submitted: number;
  total_not_submitted: number;

  total_graded: number;
  total_not_graded: number;

  progress: number;
}

export interface StatsData {
  totalAssignments: number;
  totalStudents: number;
  gradedCount: number;
  notGradedCount: number;
}
