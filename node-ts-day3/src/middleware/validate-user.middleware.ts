import type { Request, Response, NextFunction } from "express";

interface CreateUserBody {
  name?: unknown;
  email?: unknown;
}

export function validateUser(
  req: Request<{}, unknown, CreateUserBody>,
  res: Response,
  next: NextFunction,
): void {
  const { name, email } = req.body ?? {};

  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({
      success: false,
      message: "Valid name is required",
    });
    return;
  }

  if (typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({
      success: false,
      message: "Valid email is required",
    });
    return;
  }

  next();
}
