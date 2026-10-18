export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
}

export interface UserParams {
  id: string;
}

export interface CreateUserBody {
  name: string;
  email: string;
  role: "admin" | "customer";
}

export interface UpdateUserBody {
  name?: string;
  email?: string;
  role?: "admin" | "customer";
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
