import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

export async function getUserFromCookie() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  const payload = await verifyJwt(token);
  return payload;
}
