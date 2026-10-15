import {
    getActiveUsers,
    createApiResponse,
    getUserById
} from "./services/user.service.js";



async function main(): Promise<void> {
    try {
        const users = await getActiveUsers();

        const response = createApiResponse(
            users,
            "Active users fetched successfully"
        );

        console.log(response);

        const user = await getUserById(1);

        console.log("User by ID:", user);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Unexpected error:", error);
        }
    }
}

void main();