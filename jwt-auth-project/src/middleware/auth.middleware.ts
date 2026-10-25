import { type Request, type Response, type NextFunction } from "express";

import { User } from "../models/User.js";
import { verifyAccessToken } from "../utils/token.js";

// Extend Express Request with authenticated user data
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "employee" | "admin";
  };
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // Step 1: Read Authorization header
  const authorization = req.headers.authorization;

  // Step 2: Check Bearer token format
  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Access token required",
    });
    return;
  }

  // Step 3: Extract token
  const token = authorization.slice(7);

  let payload;

  try {
    payload = verifyAccessToken(token);
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
    return;
  }

  try {
    const user = await User.findById(payload.sub);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication",
      });
      return;
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });
    return;
  }

  next();
}
