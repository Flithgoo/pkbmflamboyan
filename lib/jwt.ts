// lib/jwt.ts
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signJwt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("3d")
    .sign(secret);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("@/lib/jwt.ts JWT verification failed:", err);
    return null;
  }
}
