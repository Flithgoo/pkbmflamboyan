import { createSupabaseServerClient } from "@/app/utils/supabase-server";
import { cookies } from "next/headers";

export const getAuthContext = async (): Promise<{
  token: string;
  supabase: ReturnType<typeof createSupabaseServerClient>;
}> => {
  const supabase = createSupabaseServerClient();
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new Error("No token found in cookies");
  }
  return { token, supabase };
};
