import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { User } from "../models/User.js";
import { generateAccessToken } from "../utils/token.js";

import {
  authenticate,
  requireAdmin,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

import { issueRefreshToken } from "../utils/session.js";
import { verifyRefreshToken, hashToken } from "../utils/token.js";
import { RefreshToken } from "../models/RefreshToken.js";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  password: z.string().min(12).max(128),
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid registration data",
      errors: parsed.error.flatten(),
    });
    return;
  }

  const { name, email, password } = parsed.data;

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    res.status(409).json({
      success: false,
      message: "Email already registered",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "employee",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const duplicate =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000;

    if (duplicate) {
      res.status(409).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    throw error;
  }
});

// login

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid login data",
    });
    return;
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
    return;
  }

  const accessToken = generateAccessToken(user.id, user.role);

  const refreshToken = await issueRefreshToken(user.id);

  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
    tokenType: "Bearer",
    expiresIn: 900,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// profile

authRouter.get("/profile", authenticate, async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!.id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

authRouter.get("/dashboard", authenticate, (req: AuthRequest, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to your dashboard",
    userId: req.user!.id,
    role: req.user!.role,
  });
});

authRouter.get(
  "/admin",
  authenticate,
  requireAdmin,
  (req: AuthRequest, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the admin panel",
      adminId: req.user!.id,
    });
  },
);

// refresh

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

authRouter.post("/refresh", async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Refresh token required",
    });
    return;
  }

  const oldToken = parsed.data.refreshToken;

  // 1. Verify the refresh JWT
  let payload;

  try {
    payload = verifyRefreshToken(oldToken);
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
    return;
  }

  // 2. Look up the token's database record
  const tokenHash = hashToken(oldToken);

  const storedToken = await RefreshToken.findOne({
    tokenHash,
  });

  if (
    !storedToken ||
    storedToken.userId.toString() !== payload.sub ||
    storedToken.familyId !== payload.familyId
  ) {
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
    return;
  }

  // 3. Detect reuse of a revoked token
  if (storedToken.revokedAt) {
    await RefreshToken.updateMany(
      { familyId: storedToken.familyId },
      { $set: { revokedAt: new Date() } },
    );

    res.status(401).json({
      success: false,
      message: "Session revoked",
    });
    return;
  }

  // 4. Check expiration
  if (storedToken.expiresAt <= new Date()) {
    res.status(401).json({
      success: false,
      message: "Refresh token expired",
    });
    return;
  }

  // 5. Load the user
  const user = await User.findById(payload.sub);

  if (!user) {
    res.status(401).json({
      success: false,
      message: "User no longer exists",
    });
    return;
  }

  // 6. Atomically claim the old token
  const claimed = await RefreshToken.findOneAndUpdate(
    {
      _id: storedToken._id,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    { $set: { revokedAt: new Date() } },
    { new: true },
  );

  if (!claimed) {
    res.status(401).json({
      success: false,
      message: "Refresh token already used",
    });
    return;
  }

  // 7. Generate a new access token
  const accessToken = generateAccessToken(user.id, user.role);

  // 8. Rotate the refresh token
  const refreshToken = await issueRefreshToken(
    user.id,
    storedToken.familyId as `${string}-${string}-${string}-${string}-${string}`,
  );

  // 9. Return new tokens
  res.status(200).json({
    success: true,
    message: "Tokens refreshed successfully",
    accessToken,
    refreshToken,
    tokenType: "Bearer",
    expiresIn: 900,
  });
});

// logout

authRouter.post("/logout", async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Refresh token required",
    });
    return;
  }

  const tokenHash = hashToken(parsed.data.refreshToken);

  await RefreshToken.updateOne(
    { tokenHash },
    { $set: { revokedAt: new Date() } },
  );

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
