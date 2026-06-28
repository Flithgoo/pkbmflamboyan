"use client";

import React from "react";
import { AssignmentMaterial } from "@/lib/types/assignment";
import { AssignmentCard } from "./AssignmentCard";
import { EmptyState } from "./EmptyState";

interface AssignmentGridProps {
  assignments: AssignmentMaterial[];
}

export function AssignmentGrid({ assignments }: AssignmentGridProps) {
  if (assignments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment.material_id} assignment={assignment} />
      ))}
    </div>
  );
}
