import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import ExpenseController from "@tracking/controllers/ExpenseController";
import ExpenseServices from "@tracking/services/ExpenseServices";
import ExpenseRoutes from "@tracking/routes/ExpenseRoutes";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "@tracking/middlewares/errorHandeler";
import MonthlyLimitService from "./services/MonthlyLimitService";
import MonthlyLimitController from "./controllers/MonthlyLimitController";
import MonthlyLimitRoutes from "./routes/MonthlyLimitRoutes";

dotenv.config();
const app: Application = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const expenseService = new ExpenseServices(prisma);
const expenseController = new ExpenseController(expenseService);
const expenseRoutes = new ExpenseRoutes(expenseController);

const monthlyLimitService = new MonthlyLimitService(prisma);
const monthlyLimitController = new MonthlyLimitController(monthlyLimitService);
const monthlyLimitRoutes = new MonthlyLimitRoutes(monthlyLimitController);

app.use("/api/v0", expenseRoutes.registerExpenseRoutes());
app.use("/api/v0", monthlyLimitRoutes.registerMonthlyLimitRoutes());

app.use(errorHandler);

export default app;
