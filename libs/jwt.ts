import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";
const secret = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  [key: string]: string;
  id: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  const jwtPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
  };

  return new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const { id } = payload as any;
    return { id };
  } catch (error) {
    console.error("token验证失败:", error);
    return null;
  }
}
