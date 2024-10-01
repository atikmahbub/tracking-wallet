import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import ExpenseController from "@tracking/controllers/ExpenseController";
import ExpenseServices from "@tracking/services/ExpenseServices";
import ExpenseRoutes from "@tracking/routes/ExpenseRoutes";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app: Application = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const expenseService = new ExpenseServices(prisma);
const expenseController = new ExpenseController(expenseService);
const expenseRoutes = new ExpenseRoutes(expenseController);

app.use("/api/v0", expenseRoutes.registerExpenseRoutes());

export default app;
