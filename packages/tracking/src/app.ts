import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
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
import CategoryService from "@tracking/services/CategoryService";
import CategoryController from "@tracking/controllers/CategoryController";
import CategoryRoutes from "@tracking/routes/CategoryRoutes";
import IncomeService from "@tracking/services/IncomeService";
import IncomeController from "@tracking/controllers/IncomeController";
import IncomeRoutes from "@tracking/routes/IncomeRoutes";
import IncomeCategoryService from "@tracking/services/IncomeCategoryService";
import IncomeCategoryController from "@tracking/controllers/IncomeCategoryController";
import IncomeCategoryRoutes from "@tracking/routes/IncomeCategoryRoutes";
import TransactionService from "@tracking/services/TransactionService";
import TransactionController from "@tracking/controllers/TransactionController";
import TransactionRoutes from "@tracking/routes/TransactionRoutes";
import TransactionSummaryService from "@tracking/services/TransactionSummaryService";
import TransactionSummaryController from "@tracking/controllers/TransactionSummaryController";
import TransactionSummaryRoutes from "@tracking/routes/TransactionSummaryRoutes";
import openApiDocument from "@tracking/docs/openapi";

const app: Application = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    explorer: true,
  })
);

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

const categoryService = new CategoryService(prisma);
const categoryController = new CategoryController(categoryService);
const categoryRoutes = new CategoryRoutes(categoryController);

const incomeService = new IncomeService(prisma);
const incomeController = new IncomeController(incomeService);
const incomeRoutes = new IncomeRoutes(incomeController);

const incomeCategoryService = new IncomeCategoryService(prisma);
const incomeCategoryController = new IncomeCategoryController(incomeCategoryService);
const incomeCategoryRoutes = new IncomeCategoryRoutes(incomeCategoryController);

const transactionService = new TransactionService(prisma);
const transactionController = new TransactionController(transactionService);
const transactionRoutes = new TransactionRoutes(transactionController);

const transactionSummaryService = new TransactionSummaryService(prisma);
const transactionSummaryController = new TransactionSummaryController(transactionSummaryService);
const transactionSummaryRoutes = new TransactionSummaryRoutes(transactionSummaryController);

app.use("/api/v0", expenseRoutes.registerExpenseRoutes());
app.use("/api/v0", monthlyLimitRoutes.registerMonthlyLimitRoutes());
app.use("/api/v0", userRoutes.registerUserRouter());
app.use("/api/v0", loanRoutes.registerLoanRoutes());
app.use("/api/v0", investRoutes.registerInvestRoutes());
app.use("/api/v0", categoryRoutes.registerCategoryRoutes());
app.use("/api/v0", incomeRoutes.registerIncomeRoutes());
app.use("/api/v0", incomeCategoryRoutes.registerIncomeCategoryRoutes());
app.use("/api/v0", transactionRoutes.registerTransactionRoutes());
app.use("/api/v0", transactionSummaryRoutes.registerRoutes());

app.use(errorHandler);

export default app;
