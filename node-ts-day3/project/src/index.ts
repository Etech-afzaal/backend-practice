import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import userRoutes from "./routes/user.routes.js";
import { logger } from "./middleware/logger.middleware.js";

const app = express();
const PORT = 3000;

// Built-in middleware
app.use(express.json());

// Custom middleware
app.use(logger);

// Home route
app.get("/", (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Day 3 Express API is running!",
  });
});

// User routes
app.use("/api/users", userRoutes);

// Unknown endpoints
app.use((req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    data: null,
  });
});

// Error handler (must have four parameters)
app.use(
  (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      next(err);
      return;
    }

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  },
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
