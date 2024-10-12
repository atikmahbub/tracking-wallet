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
import InvestService from "@tracking/services/InvestService";
import InvestController from "@tracking/controllers/InvestController";
import InvestRoutes from "@tracking/routes/InvestRoutes";
import { authenticateToken } from "@tracking/middlewares/authenticateToken";
import { LoanService } from "@tracking/services/LoanService";
import { LoanController } from "@tracking/controllers/LoanController";
import LoanRoutes from "@tracking/routes/LoanRoutes";

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

const loanService = new LoanService(prisma);
const loanController = new LoanController(loanService);
const loanRoutes = new LoanRoutes(loanController);

const investService = new InvestService(prisma);
const investController = new InvestController(investService);
const investRoutes = new InvestRoutes(investController);

app.use("/api/v0", expenseRoutes.registerExpenseRoutes());
app.use("/api/v0", monthlyLimitRoutes.registerMonthlyLimitRoutes());
app.use("/api/v0", userRoutes.registerUserRouter());
app.use("/api/v0", loanRoutes.registerLoanRoutes());
app.use("/api/v0", investRoutes.registerInvestRoutes());

app.use(errorHandler);

export default app;
