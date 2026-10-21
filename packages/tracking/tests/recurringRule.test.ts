import { prisma, resetDb, USER_A, USER_B } from "./helpers";
import request from "supertest";
import app from "@tracking/app";

const RULE = {
  userId: USER_A,
  type: "expense",
  amount: 25000,
  description: "Rent",
  categoryId: null,
  frequency: "monthly",
  startDate: "1793491200",
  endDate: null,
  pausedAt: null,
  lastRunDate: null,
};

const addRule = (body: object = RULE) =>
  request(app).post("/api/v0/recurring-rule/add").send(body);

describe("recurring rule", () => {
  beforeEach(resetDb);
  afterAll(() => prisma.$disconnect());

  describe("POST /recurring-rule/add", () => {
    it("creates a rule", async () => {
      const res = await addRule();
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ ...RULE });
      expect(Object.keys(res.body).sort()).toEqual(
        [
          "amount", "categoryId", "created", "description", "endDate", "frequency",
          "id", "lastRunDate", "pausedAt", "startDate", "type", "updated", "userId",
        ]
      );
    });

    it.each([
      ["type", { type: "transfer" }],
      ["frequency", { frequency: "daily" }],
      ["amount", { amount: 0 }],
      ["startDate", { startDate: "soon" }],
      ["categoryId", { categoryId: "not-a-uuid" }],
    ])("rejects a bad %s", async (_field, patch) => {
      const res = await addRule({ ...RULE, ...patch });
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(await prisma.recurringRule.count()).toBe(0);
    });
  });

  describe("GET /recurring-rule/:userId", () => {
    it("lists only the user's rules", async () => {
      await addRule();
      await addRule({ ...RULE, userId: USER_B });
      const res = await request(app).get(`/api/v0/recurring-rule/${USER_A}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].userId).toBe(USER_A);
    });
  });

  describe("PUT /recurring-rule/:id", () => {
    it("moves the cursor and clears with null", async () => {
      const { body: rule } = await addRule();
      let res = await request(app)
        .put(`/api/v0/recurring-rule/${rule.id}`)
        .send({ userId: USER_A, lastRunDate: "1793491200", pausedAt: "1793500000" });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ lastRunDate: "1793491200", pausedAt: "1793500000" });

      // Absent keys stay as they are; null resumes.
      res = await request(app)
        .put(`/api/v0/recurring-rule/${rule.id}`)
        .send({ userId: USER_A, pausedAt: null });
      expect(res.body).toMatchObject({ lastRunDate: "1793491200", pausedAt: null, amount: 25000 });
    });

    it("refuses another user's rule", async () => {
      const { body: rule } = await addRule();
      const res = await request(app)
        .put(`/api/v0/recurring-rule/${rule.id}`)
        .send({ userId: USER_B, amount: 1 });
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect((await prisma.recurringRule.findFirst())?.amount).toBe(25000);
    });
  });

  describe("DELETE /recurring-rule/:id", () => {
    it("deletes the rule but keeps its entries", async () => {
      const { body: rule } = await addRule();
      await request(app).post("/api/v0/expense/add").send({
        userId: USER_A, amount: 25000, description: "Rent", date: "1793491200",
        recurringRuleId: rule.id, occurrenceDate: "1793491200",
      });
      const res = await request(app)
        .delete(`/api/v0/recurring-rule/${rule.id}`)
        .query({ userId: USER_A });
      expect(res.status).toBe(200);
      expect(await prisma.recurringRule.count()).toBe(0);
      expect(await prisma.expense.count()).toBe(1);
    });

    it("404s an unknown rule", async () => {
      const res = await request(app)
        .delete("/api/v0/recurring-rule/6f1c2b1e-1d3a-4c8e-9b1a-2f0e8d7c6b5a")
        .query({ userId: USER_A });
      expect(res.status).toBe(404);
    });
  });
});

describe("generated entries", () => {
  beforeEach(resetDb);
  afterAll(() => prisma.$disconnect());

  const RULE_ID = "6f1c2b1e-1d3a-4c8e-9b1a-2f0e8d7c6b5a";
  const entry = (kind: "expense" | "income", patch: object = {}) =>
    request(app)
      .post(`/api/v0/${kind}/add`)
      .send({
        userId: USER_A, amount: 100, description: "Netflix", date: "1793491200",
        recurringRuleId: RULE_ID, occurrenceDate: "1793491200", ...patch,
      });

  it.each(["expense", "income"] as const)(
    "returns the existing %s for a repeated occurrence",
    async (kind) => {
      const first = await entry(kind);
      const second = await entry(kind);
      expect(first.status).toBe(201);
      expect(second.body.id).toBe(first.body.id);
      expect(first.body).toMatchObject({ recurringRuleId: RULE_ID, occurrenceDate: "1793491200" });
      const count = kind === "expense" ? prisma.expense.count() : prisma.income.count();
      expect(await count).toBe(1);
    }
  );

  it("keeps a concurrent repeat to one row", async () => {
    const results = await Promise.all([entry("expense"), entry("expense"), entry("expense")]);
    expect(new Set(results.map((r) => r.body.id)).size).toBe(1);
    expect(await prisma.expense.count()).toBe(1);
  });

  it("adds a different occurrence of the same rule", async () => {
    await entry("expense");
    await entry("expense", { occurrenceDate: "1796169600", date: "1796169600" });
    expect(await prisma.expense.count()).toBe(2);
  });

  it("leaves manual entries alone", async () => {
    const manual = { recurringRuleId: undefined, occurrenceDate: undefined };
    await entry("expense", manual);
    await entry("expense", manual);
    expect(await prisma.expense.count()).toBe(2);
  });

  it("needs the rule and occurrence together", async () => {
    const res = await entry("expense", { occurrenceDate: undefined });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
