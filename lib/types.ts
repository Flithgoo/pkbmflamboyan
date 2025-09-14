// lib/types.ts
export type Subject = {
  id: number;
  name: string;
  description: string;
  created_at: string;
};

export type TutorSubject = {
  subject: Subject;
};

export type User = {
  id: number;
  name: string;
  username: string;
  role: "admin" | "tutor" | "student";
  profile_picture?: string;
  created_at: string;
};
