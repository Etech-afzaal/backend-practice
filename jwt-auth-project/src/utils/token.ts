import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  role: "employee" | "admin";
  tokenType: "access";
}

function getAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is missing");
  }

  return secret;
}

export function generateAccessToken(
  userId: string,
  role: "employee" | "admin",
): string {
  return jwt.sign(
    {
      sub: userId,
      role,
      tokenType: "access",
    },
    getAccessSecret(),
    {
      algorithm: "HS256",
      expiresIn: "15m",
      issuer: "jwt-auth-api",
      audience: "jwt-auth-client",
    },
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, getAccessSecret(), {
    algorithms: ["HS256"],
    issuer: "jwt-auth-api",
    audience: "jwt-auth-client",
  });

  if (
    typeof decoded === "string" ||
    typeof decoded.sub !== "string" ||
    !["employee", "admin"].includes(decoded.role) ||
    decoded.tokenType !== "access"
  ) {
    throw new Error("Invalid access token");
  }

  return decoded as AccessTokenPayload;
}

import crypto from "node:crypto";

export interface RefreshTokenPayload extends jwt.JwtPayload {
  sub: string;
  jti: string;
  familyId: string;
  tokenType: "refresh";
}

export function generateRefreshToken(
  userId: string,
  tokenId: string,
  familyId: string,
): string {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is missing");
  }

  return jwt.sign(
    {
      sub: userId,
      jti: tokenId,
      familyId,
      tokenType: "refresh",
    },
    secret,
    {
      algorithm: "HS256",
      expiresIn: "7d",
      issuer: "jwt-auth-api",
      audience: "jwt-auth-client",
    },
  );
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is missing");
  }

  const decoded = jwt.verify(token, secret, {
    algorithms: ["HS256"],
    issuer: "jwt-auth-api",
    audience: "jwt-auth-client",
  });

  if (
    typeof decoded === "string" ||
    typeof decoded.sub !== "string" ||
    typeof decoded.jti !== "string" ||
    typeof decoded.familyId !== "string" ||
    decoded.tokenType !== "refresh"
  ) {
    throw new Error("Invalid refresh token");
  }

  return decoded as RefreshTokenPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
