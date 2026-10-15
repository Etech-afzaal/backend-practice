import type { User } from "../types/user.types.js";

export const users: User[] = [
    {
        id: 1,
        name: "Ali",
        email: "ali@example.com",
        role: "admin",
        status: "active",
    },
    {
        id: 2,
        name: "Ahmed",
        email: "ahmed@example.com",
        role: "customer",
        status: "inactive",
    },
    {
        id: 3,
        name: "Sara",
        email: "sara@example.com",
        role: "manager",
        status: "active",
    },
    {
        id: 4,
        name: "Usman",
        email: "usman@example.com",
        role: "customer",
        status: "active",
    },
    {
        id: 5,
        name: "Fatima",
        email: "fatima@example.com",
        role: "admin",
        status: "inactive",
    },
];
