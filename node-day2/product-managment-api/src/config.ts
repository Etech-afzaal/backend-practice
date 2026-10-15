import { loadEnvFile, env } from "node:process";

loadEnvFile();

type Environment = "development" | "test" | "production";

interface AppConfig {
    port: number;
    appName: string;
    nodeEnv: Environment;
}

const port = Number(env.PORT ?? "4000");

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
}

const nodeEnv = env.NODE_ENV ?? "development";

if (
    nodeEnv !== "development" &&
    nodeEnv !== "test" &&
    nodeEnv !== "production"
) {
    throw new Error("Invalid NODE_ENV");
}

export const config: AppConfig = {
    port,
    appName: env.APP_NAME ?? "Product API",
    nodeEnv
};