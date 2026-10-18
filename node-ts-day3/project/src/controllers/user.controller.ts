import type { Request, Response } from "express";

import * as userService from "../services/user.service.js";

import type {
  User,
  UserParams,
  UserRole,
  CreateUserBody,
  PatchUserBody,
  ApiResponse,
} from "../types/user.types.js";

type UserResult = ApiResponse<User | null>;
type UsersResult = ApiResponse<User[]>;

function parseId(value: string): number | null {
  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// Runtime validation for incoming JSON
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRole(value: unknown): value is UserRole {
  return value === "admin" || value === "customer";
}

function isCreateUserBody(value: unknown): value is CreateUserBody {
  if (!isObject(value)) return false;

  return (
    Object.keys(value).every((key) =>
      ["name", "email", "role"].includes(key),
    ) &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) &&
    isRole(value.role)
  );
}

function isPatchUserBody(value: unknown): value is PatchUserBody {
  if (!isObject(value)) return false;

  const keys = Object.keys(value);

  if (keys.length === 0) return false;

  return keys.every((key) => {
    switch (key) {
      case "name":
        return typeof value.name === "string" && value.name.trim().length > 0;

      case "email":
        return (
          typeof value.email === "string" &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
        );

      case "role":
        return isRole(value.role);

      default:
        return false;
    }
  });
}

// GET /api/users?role=admin
export function getUsers(
  req: Request,
  res: Response<UsersResult | ApiResponse<null>>,
): void {
  const rawRole: unknown = req.query.role;

  if (rawRole !== undefined && !isRole(rawRole)) {
    res.status(400).json({
      success: false,
      message: "Invalid role filter",
      data: null,
    });
    return;
  }

  const users = userService.getAllUsers(rawRole);

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
}

// GET /api/users/:id
export function getUser(
  req: Request<UserParams>,
  res: Response<UserResult>,
): void {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID",
      data: null,
    });
    return;
  }

  const user = userService.getUserById(id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
}

// POST /api/users
export function addUser(
  req: Request<{}, UserResult, unknown>,
  res: Response<UserResult>,
): void {
  if (!isCreateUserBody(req.body)) {
    res.status(400).json({
      success: false,
      message: "Invalid user data",
      data: null,
    });
    return;
  }

  const user = userService.createUser(req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
}

// PUT /api/users/:id
export function replaceUser(
  req: Request<UserParams, UserResult, unknown>,
  res: Response<UserResult>,
): void {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID",
      data: null,
    });
    return;
  }

  if (!isCreateUserBody(req.body)) {
    res.status(400).json({
      success: false,
      message: "Full user data is required",
      data: null,
    });
    return;
  }

  const user = userService.replaceUser(id, req.body);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "User replaced successfully",
    data: user,
  });
}

// PATCH /api/users/:id
export function patchUser(
  req: Request<UserParams, UserResult, unknown>,
  res: Response<UserResult>,
): void {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID",
      data: null,
    });
    return;
  }

  if (!isPatchUserBody(req.body)) {
    res.status(400).json({
      success: false,
      message: "Invalid update data",
      data: null,
    });
    return;
  }

  const user = userService.updateUser(id, req.body);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
}

// DELETE /api/users/:id
export function removeUser(
  req: Request<UserParams>,
  res: Response<ApiResponse<null>>,
): void {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID",
      data: null,
    });
    return;
  }

  const deleted = userService.deleteUser(id);

  if (!deleted) {
    res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: null,
  });
}
