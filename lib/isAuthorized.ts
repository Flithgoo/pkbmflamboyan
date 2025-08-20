import { verifyJwt } from "@/lib/jwt";

export async function isAuthorizedAdmin(token: string): Promise<boolean> {
  try {
    const payload = await verifyJwt(token);
    if (!payload || typeof payload !== "object" || !("role" in payload)) {
      return false;
    }
    return payload.role === "admin";
  } catch (error) {
    console.error("JWT verification failed:", error);
    return false;
  }
}
