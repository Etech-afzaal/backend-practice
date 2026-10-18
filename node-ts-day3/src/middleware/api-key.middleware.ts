import type { Request, Response, NextFunction } from "express";

export function checkApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const apiKey = req.header("x-api-key");

  if (apiKey !== "secret123") {
    res.status(401).json({
      success: false,
      message: "Invalid or missing API key",
    });
    return;
  }

  next();
}
