import { prisma, resetDb, USER_A, USER_B } from "./helpers";
import request from "supertest";
import app from "@tracking/app";

const goalBody = (userId = USER_A, extra: object = {}) => ({
  userId,
  name: "Eid trip",
  icon: "plane",
  target: 30000,
  ...extra,
});

const addGoal = async (userId = USER_A, extra: object = {}): Promise<any> =>
  (await request(app).post("/api/v0/savings-goal/add").send(goalBody(userId, extra)))
    .body;

const addEntry = (body: object) =>
  request(app).post("/api/v0/savings-entry/add").send(body);

const changes = (since?: number, userId = USER_A) =>
  request(app)
    .get("/api/v0/sync/changes")
    .query(since != null ? { userId, since } : { userId });

describe("savings", () => {
  beforeEach(() => resetDb());
  afterAll(() => prisma.$disconnect());

  describe("goals", () => {
    it("creates a goal with defaults", async () => {
      const res = await request(app).post("/api/v0/savings-goal/add").send(goalBody());
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        userId: USER_A,
        name: "Eid trip",
        icon: "plane",
        target: 30000,
        targetDate: null,
        refill: false,
        reachedAt: null,
      });
      expect(Object.keys(res.body).sort()).toEqual(
        [
          "created", "icon", "id", "name", "reachedAt", "refill",
          "target", "targetDate", "updated", "userId",
        ]
      );
    });

    it("keeps the date and refill switch", async () => {
      const goal = await addGoal(USER_A, { targetDate: "1810000000", refill: true });
      expect(goal.targetDate).toBe("1810000000");
      expect(goal.refill).toBe(true);
    });

    it.each([
      ["no name", { name: "" }],
      ["no icon", { icon: "" }],
      ["zero target", { target: 0 }],
      ["negative target", { target: -5 }],
      ["bad date", { targetDate: "soon" }],
      ["refill not a boolean", { refill: "yes" }],
    ])("rejects %s", async (_label, extra) => {
      const res = await request(app)
        .post("/api/v0/savings-goal/add")
        .send(goalBody(USER_A, extra));
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    });

    it("lists only the user's goals", async () => {
      await addGoal();
      await addGoal(USER_B);
      const res = await request(app).get(`/api/v0/savings-goal/${USER_A}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].userId).toBe(USER_A);
    });

    it("updates fields, sets and clears the date and reached time", async () => {
      const goal = await addGoal(USER_A, { targetDate: "1810000000" });
      const up = await request(app)
        .put(`/api/v0/savings-goal/${goal.id}`)
        .send({ userId: USER_A, target: 35000, reachedAt: "1790000000", targetDate: null });
      expect(up.status).toBe(200);
      expect(up.body).toMatchObject({
        name: "Eid trip",
        target: 35000,
        targetDate: null,
        reachedAt: "1790000000",
      });
      const reopen = await request(app)
        .put(`/api/v0/savings-goal/${goal.id}`)
        .send({ userId: USER_A, reachedAt: null });
      expect(reopen.body.reachedAt).toBeNull();
      expect(reopen.body.target).toBe(35000);
    });

    it("won't let another user change or delete a goal (401)", async () => {
      const goal = await addGoal();
      const put = await request(app)
        .put(`/api/v0/savings-goal/${goal.id}`)
        .send({ userId: USER_B, name: "Mine now" });
      expect(put.status).toBe(401);
      const del = await request(app)
        .delete(`/api/v0/savings-goal/${goal.id}`)
        .query({ userId: USER_B });
      expect(del.status).toBe(401);
      expect(await prisma.savingsGoal.count()).toBe(1);
    });

    it("answers 404 for a goal that doesn't exist", async () => {
      const res = await request(app)
        .delete("/api/v0/savings-goal/6f1c2a0e-9d3b-4f5a-8c7d-1e2f3a4b5c6d")
        .query({ userId: USER_A });
      expect(res.status).toBe(404);
    });
  });

  describe("entries", () => {
    it("adds and withdraws with a signed amount", async () => {
      const goal = await addGoal();
      const add = await addEntry({
        userId: USER_A, goalId: goal.id, amount: 5000, date: "1767312000", note: "bonus",
      });
      expect(add.status).toBe(201);
      expect(add.body).toMatchObject({
        goalId: goal.id, userId: USER_A, amount: 5000, date: "1767312000", note: "bonus",
      });
      const take = await addEntry({
        userId: USER_A, goalId: goal.id, amount: -1000, date: "1767398400",
      });
      expect(take.status).toBe(201);
      expect(take.body.amount).toBe(-1000);
      expect(take.body.note).toBeNull();

      const list = await request(app).get(`/api/v0/savings-entry/${USER_A}`);
      expect(list.body).toHaveLength(2);
    });

    it.each([
      ["zero", { amount: 0 }],
      ["not a number", { amount: "lots" }],
      ["bad date", { date: "yesterday" }],
      ["bad goal id", { goalId: "nope" }],
    ])("rejects %s", async (_label, extra) => {
      const goal = await addGoal();
      const res = await addEntry({
        userId: USER_A, goalId: goal.id, amount: 100, date: "1767312000", ...extra,
      });
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    });

    it("404 for an unknown goal, 401 for someone else's goal", async () => {
      const missing = await addEntry({
        userId: USER_A, goalId: "6f1c2a0e-9d3b-4f5a-8c7d-1e2f3a4b5c6d",
        amount: 1, date: "1767312000",
      });
      expect(missing.status).toBe(404);
      const goal = await addGoal();
      const foreign = await addEntry({
        userId: USER_B, goalId: goal.id, amount: 1, date: "1767312000",
      });
      expect(foreign.status).toBe(401);
    });

    it("updates and deletes an entry, only for its owner", async () => {
      const goal = await addGoal();
      const entry = (
        await addEntry({ userId: USER_A, goalId: goal.id, amount: 100, date: "1767312000" })
      ).body;
      const up = await request(app)
        .put(`/api/v0/savings-entry/${entry.id}`)
        .send({ userId: USER_A, amount: -250, note: "fixed" });
      expect(up.status).toBe(200);
      expect(up.body).toMatchObject({ amount: -250, note: "fixed", date: "1767312000" });

      const foreign = await request(app)
        .delete(`/api/v0/savings-entry/${entry.id}`)
        .query({ userId: USER_B });
      expect(foreign.status).toBe(401);
      const del = await request(app)
        .delete(`/api/v0/savings-entry/${entry.id}`)
        .query({ userId: USER_A });
      expect(del.status).toBe(200);
      expect(await prisma.savingsEntry.count()).toBe(0);
    });
  });

  describe("sync", () => {
    it("sends goals and entries to their owner only", async () => {
      const goal = await addGoal();
      const entry = (
        await addEntry({ userId: USER_A, goalId: goal.id, amount: 10, date: "1767312000" })
      ).body;
      await addGoal(USER_B);

      const { body } = await changes();
      expect(body.savingsGoals.map((g: any) => g.id)).toEqual([goal.id]);
      expect(body.savingsEntries.map((e: any) => e.id)).toEqual([entry.id]);
    });

    it("reports a deleted goal and its entries, and unlinks paid expenses", async () => {
      const goal = await addGoal();
      const entry = (
        await addEntry({ userId: USER_A, goalId: goal.id, amount: 10, date: "1767312000" })
      ).body;
      const expense = await request(app).post("/api/v0/expense/add").send({
        userId: USER_A, amount: 7, date: "1767312000", savingsGoalId: goal.id,
      });
      expect(expense.status).toBe(201);
      expect(expense.body.savingsGoalId).toBe(goal.id);
      const { body: before } = await changes();

      const del = await request(app)
        .delete(`/api/v0/savings-goal/${goal.id}`)
        .query({ userId: USER_A });
      expect(del.status).toBe(200);

      const { body } = await changes(before.cursor);
      expect(body.deleted).toEqual(
        expect.arrayContaining([
          { entity: "savingsGoal", id: goal.id },
          { entity: "savingsEntry", id: entry.id },
        ])
      );
      const kept = body.expenses.find((e: any) => e.id === expense.body.id);
      expect(kept).toBeDefined();
      expect(kept.savingsGoalId).toBeNull();

      const other = await changes(before.cursor, USER_B);
      expect(other.body.deleted).toEqual([]);
    });
  });

  describe("expense paid from a goal", () => {
    const addExpense = (body: object) =>
      request(app).post("/api/v0/expense/add").send({
        userId: USER_A, amount: 100, date: "1767312000", ...body,
      });

    it("stores the link and returns null without one", async () => {
      const goal = await addGoal();
      const linked = await addExpense({ savingsGoalId: goal.id });
      expect(linked.body.savingsGoalId).toBe(goal.id);
      const plain = await addExpense({});
      expect(plain.body.savingsGoalId).toBeNull();
    });

    it("rejects someone else's or an unknown goal", async () => {
      const foreign = await addGoal(USER_B);
      expect((await addExpense({ savingsGoalId: foreign.id })).status).toBe(404);
      expect(
        (await addExpense({ savingsGoalId: "6f1c2a0e-9d3b-4f5a-8c7d-1e2f3a4b5c6d" })).status
      ).toBe(404);
      expect((await addExpense({ savingsGoalId: "nope" })).status).toBe(400);
    });

    it("sets, keeps and clears the link on update", async () => {
      const goal = await addGoal();
      const expense = (await addExpense({})).body;
      const set = await request(app)
        .put(`/api/v0/expense/${expense.id}`)
        .send({ savingsGoalId: goal.id });
      expect(set.body.savingsGoalId).toBe(goal.id);
      const keep = await request(app)
        .put(`/api/v0/expense/${expense.id}`)
        .send({ amount: 120 });
      expect(keep.body.savingsGoalId).toBe(goal.id);
      const clear = await request(app)
        .put(`/api/v0/expense/${expense.id}`)
        .send({ savingsGoalId: null });
      expect(clear.body.savingsGoalId).toBeNull();
    });
  });
});
