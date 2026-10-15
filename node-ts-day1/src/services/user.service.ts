import { users } from "../data/users.js";

import type {
    User,
    UserRole,
    ApiResponse,
    UserSummary
} from "../types/user.types.js";

export async function getActiveUsers(): Promise<User[]> {
    await delay(1000);

    return users.filter(
        (user) => user.status === "active"
    );
}

export async function getUserById(
    id: number
): Promise<User | null> {
    await delay(1000);

    const user = users.find(
        (user) => user.id === id
    );

    return user ?? null;
}

export async function getUserByIdOrThrow(
    id: number
): Promise<User> {
    await delay(1000);

    const user = users.find(
        (user) => user.id === id
    );

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}


export async function getUserNames(): Promise<string[]> {
    await delay(1000);

    const names: string[] = users.map(
        (user) => user.name
    );

    return names;
}


export async function getUserSummaries(): Promise<UserSummary[]> {
    await delay(1000);

    return users.map((user) => {
        const { id, name } = user;

        return {
            id,
            name
        };
    });
}

export function getUsersByRole(role: UserRole): User[] {
    return users.filter((user) => user.role === role);
}

export function createApiResponse<T>(data: T, message: string): ApiResponse<T> {
    return {
        success: true,
        message,
        data,
    };
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

