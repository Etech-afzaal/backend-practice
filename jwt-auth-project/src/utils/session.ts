import crypto from "node:crypto";
import { Types } from "mongoose";

import { RefreshToken } from "../models/RefreshToken.js";

import { generateRefreshToken, hashToken } from "./token.js";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export async function issueRefreshToken(
  userId: string,
  familyId = crypto.randomUUID(),
): Promise<string> {
  const tokenId = crypto.randomUUID();

  const refreshToken = generateRefreshToken(userId, tokenId, familyId);

  await RefreshToken.create({
    userId: new Types.ObjectId(userId),
    tokenHash: hashToken(refreshToken),
    familyId,
    expiresAt: new Date(Date.now() + SEVEN_DAYS),
    revokedAt: null,
  });

  return refreshToken;
}
