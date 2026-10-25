import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "JWT Authentication API is running",
  });
});

async function startServer(): Promise<void> {
  await connectDB();

  const PORT = Number(process.env.PORT) || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
