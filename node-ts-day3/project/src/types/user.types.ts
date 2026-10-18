export type UserRole = "admin" | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserBody {
  name: string;
  email: string;
  role: UserRole;
}

export type UpdateUserBody = CreateUserBody;

export type PatchUserBody = Partial<CreateUserBody>;

export interface UserParams {
  id: string;
}

export interface UserQuery {
  role?: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
