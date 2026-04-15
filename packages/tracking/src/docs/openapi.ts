const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Tracking Wallet API",
    version: "1.0.0",
    description:
      "REST API for managing expenses, categories, and analytics within Tracking Wallet.",
  },
  servers: [
    {
      url: "http://localhost:5001",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Expenses", description: "Expense management" },
    { name: "Incomes", description: "Income management" },
    { name: "Categories", description: "Expense category management" },
    { name: "Income Categories", description: "Income category management" },
    { name: "Transactions", description: "Unified transaction history" },
    { name: "Analytics", description: "Insights & breakdowns" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Category: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          icon: { type: "string", description: "Optional icon identifier" },
          color: { type: "string", description: "Hex color code" },
          created: { type: "string", format: "date-time" },
          updated: { type: "string", format: "date-time" },
        },
        required: ["id", "name", "icon", "color", "created", "updated"],
      },
      Expense: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string" },
          amount: { type: "number" },
          description: { type: "string", nullable: true },
          date: {
            type: "string",
            description: "Unix timestamp (seconds) serialized as string",
          },
          created: {
            type: "string",
            description: "Unix timestamp (seconds) serialized as string",
          },
          updated: {
            type: "string",
            description: "Unix timestamp (seconds) serialized as string",
          },
          categoryId: { type: "string", nullable: true },
          category: { $ref: "#/components/schemas/Category" },
        },
        required: ["id", "userId", "amount", "date", "created", "updated"],
      },
      ExpenseAnalytics: {
        type: "object",
        properties: {
          totalExpense: { type: "number" },
          categoryBreakdown: {
            type: "array",
            items: {
              type: "object",
              properties: {
                categoryId: { type: "string", nullable: true },
                categoryName: { type: "string", nullable: true },
                totalAmount: { type: "number" },
                percentage: { type: "number" },
              },
              required: ["totalAmount", "percentage"],
            },
          },
          topCategory: {
            type: "object",
            nullable: true,
            properties: {
              categoryId: { type: "string", nullable: true },
              categoryName: { type: "string", nullable: true },
              totalAmount: { type: "number" },
            },
          },
        },
        required: ["totalExpense", "categoryBreakdown"],
      },
      ExpenseCreateRequest: {
        type: "object",
        properties: {
          userId: { type: "string" },
          amount: { type: "number" },
          description: { type: "string", nullable: true },
          date: {
            type: "string",
            description: "Unix timestamp (seconds) serialized as string",
          },
          categoryId: { type: "string", nullable: true },
        },
        required: ["userId", "amount", "date"],
      },
      ExpenseUpdateRequest: {
        type: "object",
        properties: {
          amount: { type: "number", nullable: true },
          description: { type: "string", nullable: true },
          date: {
            type: "string",
            nullable: true,
            description: "Unix timestamp (seconds) serialized as string",
          },
          categoryId: { type: "string", nullable: true },
        },
      },
      IncomeCategory: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          icon: { type: "string" },
          color: { type: "string" },
          userId: { type: "string", nullable: true },
          created: { type: "string", format: "date-time" },
          updated: { type: "string", format: "date-time" },
        },
        required: ["id", "name", "icon", "color", "created", "updated"],
      },
      Income: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string" },
          amount: { type: "number" },
          description: { type: "string", nullable: true },
          date: { type: "string" },
          created: { type: "string" },
          updated: { type: "string" },
          categoryId: { type: "string", nullable: true },
          category: { $ref: "#/components/schemas/IncomeCategory" },
        },
        required: ["id", "userId", "amount", "date", "created", "updated"],
      },
      IncomeAnalytics: {
        type: "object",
        properties: {
          totalIncome: { type: "number" },
          categoryBreakdown: {
            type: "array",
            items: {
              type: "object",
              properties: {
                categoryId: { type: "string", nullable: true },
                categoryName: { type: "string", nullable: true },
                totalAmount: { type: "number" },
                percentage: { type: "number" },
              },
            },
          },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          type: { type: "string", enum: ["expense", "income"] },
          amount: { type: "number" },
          description: { type: "string", nullable: true },
          date: { type: "string" },
          category: {
            type: "object",
            nullable: true,
            properties: {
              name: { type: "string", nullable: true },
              icon: { type: "string", nullable: true },
              color: { type: "string", nullable: true },
            },
          },
        },
      },
      CategoryCreateRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          icon: { type: "string" },
          color: { type: "string" },
        },
        required: ["name", "icon", "color"],
      },
      IncomeCategoryCreateRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          icon: { type: "string" },
          color: { type: "string" },
          userId: { type: "string", nullable: true },
        },
        required: ["name", "icon", "color"],
      },
      IncomeCreateRequest: {
        type: "object",
        properties: {
          userId: { type: "string" },
          amount: { type: "number" },
          description: { type: "string", nullable: true },
          date: { type: "string" },
          categoryId: { type: "string", nullable: true },
        },
        required: ["userId", "amount", "date"],
      },
      IncomeUpdateRequest: {
        type: "object",
        properties: {
          amount: { type: "number", nullable: true },
          description: { type: "string", nullable: true },
          date: { type: "string", nullable: true },
          categoryId: { type: "string", nullable: true },
        },
      },
      TransactionSummary: {
        type: "object",
        properties: {
          totalExpense: { type: "number" },
          totalIncome: { type: "number" },
          expenseChangePercentage: { type: "number" },
          incomeChangePercentage: { type: "number" },
        },
        required: [
          "totalExpense",
          "totalIncome",
          "expenseChangePercentage",
          "incomeChangePercentage",
        ],
      },
    },
  },
  paths: {
    "/api/v0/expense/add": {
      post: {
        tags: ["Expenses"],
        summary: "Create a new expense",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExpenseCreateRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Expense created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Expense" },
              },
            },
          },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/v0/expense/{id}": {
      put: {
        tags: ["Expenses"],
        summary: "Update an existing expense",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExpenseUpdateRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated expense",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Expense" },
              },
            },
          },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
          "404": { description: "Expense not found" },
        },
      },
      delete: {
        tags: ["Expenses"],
        summary: "Delete an expense",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Expense deleted" },
          "401": { description: "Unauthorized" },
          "404": { description: "Expense not found" },
        },
      },
    },
    "/api/v0/expenses/{userId}": {
      get: {
        tags: ["Expenses"],
        summary: "List expenses for a user within a month",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "date",
            in: "query",
            required: true,
            schema: {
              type: "string",
              description: "Unix timestamp (seconds) for target month",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of expenses",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Expense" },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/v0/expenses/analytics": {
      get: {
        tags: ["Analytics"],
        summary: "Get expense analytics for a month",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "date",
            in: "query",
            required: true,
            schema: {
              type: "string",
              description: "Unix timestamp (seconds) for target month",
            },
          },
        ],
        responses: {
          "200": {
            description: "Expense analytics payload",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ExpenseAnalytics" },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/v0/expense/notifications/{userId}/exceed-limit": {
      get: {
        tags: ["Expenses"],
        summary: "Check if a user exceeded their monthly limit",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description:
              "Boolean flag indicating whether the limit was exceeded",
            content: {
              "application/json": {
                schema: { type: "boolean" },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/v0/categories": {
      get: {
        tags: ["Categories"],
        summary: "List all global categories",
        security: [{ bearerAuth: [] }],
        parameters: [],
        responses: {
          "200": {
            description: "Categories",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create a new category",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryCreateRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Category created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Category" },
              },
            },
          },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/v0/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get a category by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Category details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Category" },
              },
            },
          },
          "401": { description: "Unauthorized" },
          "404": { description: "Category not found" },
        },
      },
    },
    "/api/v0/income/add": {
      post: {
        tags: ["Incomes"],
        summary: "Create a new income",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/IncomeCreateRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Income created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Income" },
              },
            },
          },
        },
      },
    },
    "/api/v0/income/{id}": {
      put: {
        tags: ["Incomes"],
        summary: "Update an existing income",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/IncomeUpdateRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated income",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Income" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Incomes"],
        summary: "Delete an income",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Income deleted" },
        },
      },
    },
    "/api/v0/income/{userId}": {
      get: {
        tags: ["Incomes"],
        summary: "List incomes for a user within a month",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "date",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "List of incomes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Income" },
                },
              },
            },
          },
        },
      },
    },
    "/api/v0/income/analytics": {
      get: {
        tags: ["Analytics"],
        summary: "Get income analytics for a month",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "date",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Income analytics payload",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/IncomeAnalytics" },
              },
            },
          },
        },
      },
    },
    "/api/v0/income-categories/{userId}": {
      get: {
        tags: ["Income Categories"],
        summary: "List income categories for a user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Income categories",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/IncomeCategory" },
                },
              },
            },
          },
        },
      },
    },
    "/api/v0/income-categories": {
      post: {
        tags: ["Income Categories"],
        summary: "Create a new income category",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/IncomeCategoryCreateRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Income category created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/IncomeCategory" },
              },
            },
          },
        },
      },
    },
    "/api/v0/income-category/{id}": {
      get: {
        tags: ["Income Categories"],
        summary: "Get an income category by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Income category details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/IncomeCategory" },
              },
            },
          },
        },
      },
    },
    "/api/v0/transactions": {
      get: {
        tags: ["Transactions"],
        summary: "Get unified transaction history",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "date",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Unified transactions",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Transaction" },
                },
              },
            },
          },
        },
      },
    },
    "/api/v0/transactions/summary/{userId}": {
      get: {
        tags: ["Analytics", "Transactions"],
        summary: "Get monthly transaction summary and percentage changes",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "date",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Monthly transaction summary",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionSummary" },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },
  },
};

export default openApiDocument;
