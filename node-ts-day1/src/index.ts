import {
    getActiveUsers,
    createApiResponse,
    getUserById,
    getUserByIdOrThrow,
    getUserNames,
    getUserSummaries
} from "./services/user.service.js";

async function main(): Promise<void> {
    try {
        // 1. Get active users
        const users = await getActiveUsers();

        const response = createApiResponse(
            users,
            "Active users fetched successfully"
        );

        console.log(response);

        // 2. Find a user (returns null if not found)
        const user = await getUserById(999);

        console.log("User by ID:", user);

        // 3. Successful lookup
        const existingUser = await getUserByIdOrThrow(1);

        console.log("Existing User:", existingUser);

        // 4. Test error handling independently
        try {
            await getUserByIdOrThrow(999);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Lookup failed:", error.message);
            } else {
                console.error("Unexpected lookup error:", error);
            }
        }

        console.log("Program completed.");

        const names = await getUserNames();

        console.log("User Names:", names);

        const summaries = await getUserSummaries();

        console.log("User Summaries:", summaries);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Main error:", error.message);
        } else {
            console.error("Unexpected error:", error);
        }
    }
}

void main();