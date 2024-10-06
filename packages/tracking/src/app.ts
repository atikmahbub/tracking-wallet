import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import express, { Application } from "express";
import cors from "cors";
import ExpenseController from "@tracking/controllers/ExpenseController";
import ExpenseServices from "@tracking/services/ExpenseServices";
import ExpenseRoutes from "@tracking/routes/ExpenseRoutes";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "@tracking/middlewares/errorHandler";
import MonthlyLimitService from "@tracking/services/MonthlyLimitService";
import MonthlyLimitController from "@tracking/controllers/MonthlyLimitController";
import MonthlyLimitRoutes from "@tracking/routes/MonthlyLimitRoutes";
import UserService from "@tracking/services/UserService";
import UserRoutes from "@tracking/routes/UserRouter";
import UserController from "@tracking/controllers/UserController";
import { authenticateToken } from "@tracking/middlewares/authenticateToken";

const app: Application = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use(authenticateToken);

const expenseService = new ExpenseServices(prisma);
const expenseController = new ExpenseController(expenseService);
const expenseRoutes = new ExpenseRoutes(expenseController);

const monthlyLimitService = new MonthlyLimitService(prisma);
const monthlyLimitController = new MonthlyLimitController(monthlyLimitService);
const monthlyLimitRoutes = new MonthlyLimitRoutes(monthlyLimitController);

const userService = new UserService(prisma);
const userController = new UserController(userService);
const userRoutes = new UserRoutes(userController);

app.use("/api/v0", expenseRoutes.registerExpenseRoutes());
app.use("/api/v0", monthlyLimitRoutes.registerMonthlyLimitRoutes());
app.use("/api/v0", userRoutes.registerUserRouter());

app.use(errorHandler);

export default app;
