import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/src/lib/database.types";

export function createSupabaseServerClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookies() }
  );
}
