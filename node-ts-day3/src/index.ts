import express, { type Request, type Response, NextFunction } from "express";

import { logger } from "./middleware/logger.middleware.js";
import { validateUser } from "./middleware/validate-user.middleware.js";
import { checkApiKey } from "./middleware/api-key.middleware.js";

import type { User, UserParams, ApiResponse } from "./types/user.types.js";

const app = express();

const PORT: number = 3000;
// Middleware to parse JSON request bodies
app.use(express.json());

app.use(logger);

const users: User[] = [
  {
    id: 1,
    name: "Ali",
    email: "ali@example.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Sara",
    email: "sara@example.com",
    role: "customer",
  },
];

// GET - userid
app.get(
  "/users/:id",
  (req: Request<UserParams>, res: Response<ApiResponse<User | null>>): void => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
        data: null,
      });
      return;
    }

    const user = users.find((user) => user.id === id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  },
);

// GET - Retrieve users
// app.get("/users", (req: Request, res: Response): void => {
//   res.status(200).json({
//     success: true,
//     message: "Users fetched successfully",
//   });
// });

app.get("/protected", checkApiKey, (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Access granted",
  });
});

// POST - Validate and create user

app.post("/users", validateUser, (req: Request, res: Response): void => {
  res.status(201).json({
    success: true,
    message: "User validated successfully",
    data: req.body,
  });
});

// PUT - Replace user
app.put("/users/:id", (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "User replaced successfully",
  });
});

// PATCH - Update specific fields
app.patch("/users/:id", (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
});

// DELETE - Remove user
app.delete("/users/:id", (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// exercise
app.get("/products", (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: [
      { id: 1, name: "Laptop", price: 150000 },
      { id: 2, name: "Mouse", price: 2500 },
    ],
  });
});

// create product api

interface CreateProductBody {
  name: string;
  price: number;
  category: string;
}

app.post(
  "/products",
  (req: Request<{}, unknown, CreateProductBody>, res: Response): void => {
    const { name, price, category } = req.body;

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        name,
        price,
        category,
      },
    });
  },
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// gg

app.get(
  "/users/:id",
  (req: Request<UserParams>, res: Response<ApiResponse<User>>): void => {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId < 1) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
        data: {
          id: 0,
          name: "",
          email: "",
          role: "customer",
        },
      });
      return;
    }

    const user: User = {
      id: userId,
      name: "Ali",
      email: "ali@example.com",
      role: "admin",
    };

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  },
);
