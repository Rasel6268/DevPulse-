import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import express, { type Application, type Request, type Response } from "express";
import initDB from "./config/db";
import userRouter from "./modules/user/user.route";
import issuesRouter from './modules/issues/issues.route';
import cookieParser from 'cookie-parser';




const app: Application = express();
app.use(cookieParser());
app.use(express.json());

//database connection
initDB();


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is Cooking Now! 🍳",
    url: "http://localhost:3001",
    project: "Assignment Base API Server",
    author: "Md. Rasel Hossain Emeli",
    platform: "Programming Hero",
  });
});

app.use("/users", userRouter);
app.use('/issues',issuesRouter)

export default app;