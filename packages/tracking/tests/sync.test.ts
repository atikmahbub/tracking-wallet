import { prisma, resetDb, USER_A, USER_B } from "./helpers";
import request from "supertest";
import app from "@tracking/app";

const loanBody = (userId = USER_A) => ({
  userId,
  name: "Rahim",
  amount: 1000,
  note: null,
  deadLine: "1767225600",
  loanType: 1,
});

const changes = (since?: number, userId = USER_A) =>
  request(app)
    .get("/api/v0/sync/changes")
    .query(since != null ? { userId, since } : { userId });

describe("sync support", () => {
  beforeEach(() => resetDb());
  afterAll(() => prisma.$disconnect());

  describe("Idempotency-Key", () => {
    it("replays the first response instead of creating a duplicate", async () => {
      const first = await request(app)
        .post("/api/v0/loan/add")
        .set("Idempotency-Key", "k1")
        .send(loanBody());
      const retry = await request(app)
        .post("/api/v0/loan/add")
        .set("Idempotency-Key", "k1")
        .send(loanBody());

      expect(first.status).toBe(201);
      expect(retry.status).toBe(201);
      expect(retry.body.id).toBe(first.body.id);
      expect(await prisma.loan.count()).toBe(1);
    });

    it("creates separately for different keys and without a key", async () => {
      await request(app).post("/api/v0/loan/add").set("Idempotency-Key", "a").send(loanBody());
      await request(app).post("/api/v0/loan/add").set("Idempotency-Key", "b").send(loanBody());
      await request(app).post("/api/v0/loan/add").send(loanBody());
      await request(app).post("/api/v0/loan/add").send(loanBody());
      expect(await prisma.loan.count()).toBe(4);
    });

    it("answers 409 while the first attempt is still running", async () => {
      await prisma.idempotencyKey.create({ data: { key: "anonymous:busy" } });
      const res = await request(app)
        .post("/api/v0/loan/add")
        .set("Idempotency-Key", "busy")
        .send(loanBody());
      expect(res.status).toBe(409);
      expect(await prisma.loan.count()).toBe(0);
    });

    it("takes over a key whose attempt was abandoned", async () => {
      await prisma.idempotencyKey.create({
        data: { key: "anonymous:stale", created: new Date(Date.now() - 10 * 60_000) },
      });
      const res = await request(app)
        .post("/api/v0/loan/add")
        .set("Idempotency-Key", "stale")
        .send(loanBody());
      expect(res.status).toBe(201);
      expect(await prisma.loan.count()).toBe(1);
    });

    it("lets a request that failed validation be retried with the same result", async () => {
      const bad = { ...loanBody(), name: undefined };
      const first = await request(app).post("/api/v0/loan/add").set("Idempotency-Key", "v").send(bad);
      const retry = await request(app).post("/api/v0/loan/add").set("Idempotency-Key", "v").send(bad);
      expect(retry.status).toBe(first.status);
      expect(retry.body).toEqual(first.body);
    });
  });

  describe("GET /sync/changes", () => {
    it("returns everything without a cursor, and nothing new after it", async () => {
      await request(app).post("/api/v0/loan/add").send(loanBody());
      await request(app).post("/api/v0/loan/add").send(loanBody(USER_B));

      const all = await changes();
      expect(all.status).toBe(200);
      expect(all.body.loans).toHaveLength(1);
      expect(all.body.loans[0].userId).toBe(USER_A);
      expect(typeof all.body.cursor).toBe("number");
      expect(all.body.deleted).toEqual([]);

      // Older than the overlap window: nothing changed since.
      const later = await changes(all.body.cursor + 120_000);
      expect(later.body.loans).toHaveLength(0);
    });

    it("reports deletes, including a loan's payments", async () => {
      const loan = await request(app).post("/api/v0/loan/add").send(loanBody());
      const payment = await request(app).post("/api/v0/loan-payment/add").send({
        userId: USER_A,
        loanId: loan.body.id,
        amount: 10,
        date: "1767312000",
      });
      const { body: before } = await changes();

      const del = await request(app).delete(`/api/v0/loan/${loan.body.id}`);
      expect(del.status).toBeLessThan(300);

      const { body } = await changes(before.cursor);
      expect(body.deleted).toEqual(
        expect.arrayContaining([
          { entity: "loan", id: loan.body.id },
          { entity: "loanPayment", id: payment.body.id },
        ])
      );
      // Other users never see them.
      const other = await changes(before.cursor, USER_B);
      expect(other.body.deleted).toEqual([]);
    });

    it("sends expenses a deleted category was removed from", async () => {
      const category = await request(app)
        .post("/api/v0/categories")
        .send({ userId: USER_A, name: "Gym", icon: "dumbbell", color: "#fff" });
      expect(category.body.userId).toBe(USER_A);
      const expense = await request(app).post("/api/v0/expense/add").send({
        userId: USER_A,
        amount: 5,
        date: "1767312000",
        description: null,
        categoryId: category.body.id,
      });
      expect(expense.status).toBe(201);

      // The expense was last written an hour ago; ask for the last 10 minutes.
      await prisma.expense.updateMany({ data: { updated: new Date(Date.now() - 3_600_000) } });
      const since = Date.now() - 10 * 60_000;
      expect((await changes(since)).body.expenses).toHaveLength(0);

      const del = await request(app)
        .delete(`/api/v0/categories/${category.body.id}`)
        .query({ userId: USER_A });
      expect(del.status).toBe(204);

      const { body } = await changes(since);
      expect(body.deleted).toContainEqual({ entity: "category", id: category.body.id });
      expect(body.expenses).toHaveLength(1);
      expect(body.expenses[0].categoryId).toBeNull();
    });
  });

  describe("deletes", () => {
    it("answers 404 with a JSON body for a row that's already gone", async () => {
      const res = await request(app).delete(
        "/api/v0/expense/00000000-0000-4000-8000-000000000000"
      );
      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });
  });
});
