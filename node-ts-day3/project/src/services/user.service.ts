import { users } from "../data/users.js";

import type {
  User,
  CreateUserBody,
  UpdateUserBody,
  PatchUserBody,
  UserRole,
} from "../types/user.types.js";

// GET ALL
export function getAllUsers(role?: UserRole): User[] {
  return role ? users.filter((user) => user.role === role) : users;
}

// GET BY ID
export function getUserById(id: number): User | undefined {
  return users.find((user) => user.id === id);
}

// CREATE
export function createUser(data: CreateUserBody): User {
  const newUser: User = {
    id: Math.max(0, ...users.map((u) => u.id)) + 1,
    ...data,
  };

  users.push(newUser);

  return newUser;
}

// PUT - REPLACE
export function replaceUser(
  id: number,
  data: UpdateUserBody,
): User | undefined {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) return undefined;

  const updatedUser: User = { id, ...data };

  users[index] = updatedUser;

  return updatedUser;
}

// PATCH - PARTIAL UPDATE
export function updateUser(id: number, data: PatchUserBody): User | undefined {
  const user = getUserById(id);

  if (!user) return undefined;

  Object.assign(user, data);

  return user;
}

// DELETE
export function deleteUser(id: number): boolean {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) return false;

  users.splice(index, 1);

  return true;
}
