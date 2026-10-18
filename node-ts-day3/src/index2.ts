import express, { type Request, type Response, NextFunction } from "express";

const app = express();

const PORT: number = 3000;

const logger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`${req.method} ${req.url}`);

  next();
};

app.use(logger);
