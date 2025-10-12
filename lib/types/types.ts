import type { Database } from "@/src/lib/database.types";

export type Location = Database["public"]["Tables"]["location"]["Row"];

export type Classes = Database["public"]["Tables"]["classes"]["Row"];

export type Subject = Database["public"]["Tables"]["subjects"]["Row"];

export type Material = Database["public"]["Tables"]["materials"]["Row"];
