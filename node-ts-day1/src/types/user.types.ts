export type UserRole = "admin" | "customer" | "manager";

export type UserStatus = "active" | "inactive";

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface UserSummary {
    id: number;
    name: string;
}