"use client";

import { useEffect, useState } from "react";
import { getAllTutor } from "@/lib/api/tutor";
import { getAllTutorSubject } from "@/lib/api/tutor_subject";
import { Database } from "@/src/lib/database.types";

type SubjectWithTutor = Database["public"]["Tables"]["subjects"]["Row"] & {
  tutor_subjects: {
    users: Database["public"]["Tables"]["users"]["Row"];
  }[];
};

export function useTutorSubjects() {
  const [tutorSubjects, setTutorSubjects] = useState<SubjectWithTutor[]>([]);
  const [tutors, setTutors] = useState<
    Database["public"]["Tables"]["users"]["Row"][]
  >([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const [{ data: tutorList }, { data: subjectList }] = await Promise.all([
      getAllTutor(),
      getAllTutorSubject(),
    ]);
    setTutors(tutorList ?? []);
    setTutorSubjects(subjectList ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return { tutorSubjects, tutors, refresh, loading };
}
