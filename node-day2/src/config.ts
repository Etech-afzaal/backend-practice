import process from "node:process";

process.loadEnvFile();

const port = Number(process.env.PORT ?? "4000");

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid port number");
}

type Environment = "development" | "test" | "production";

const envValue = process.env.NODE_ENV ?? "development";

function isEnvironment(value: string): value is Environment {
    return (
        value === "development" ||
        value === "test" ||
        value === "production"
    );
}

if (!isEnvironment(envValue)) {
    throw new Error("Invalid NODE_ENV");
}

interface AppConfig {
    port: number;
    appName: string;
    nodeEnv: Environment;
}

export const config: AppConfig = {
    port,
    appName: process.env.APP_NAME ?? "Node Backend",
    nodeEnv: envValue
};