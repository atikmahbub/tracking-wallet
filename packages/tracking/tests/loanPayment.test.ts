import { prisma, resetDb, USER_A, USER_B } from "./helpers";
import request from "supertest";
import app from "@tracking/app";

const addLoan = async (userId = USER_A): Promise<string> => {
  const res = await request(app).post("/api/v0/loan/add").send({
    userId,
    name: "Rahim",
    amount: 1000,
    note: null,
    deadLine: "1767225600",
    loanType: 1,
  });
  return res.body.id;
};

const addPayment = (body: object) =>
  request(app).post("/api/v0/loan-payment/add").send(body);

describe("loan payment", () => {
  let loanId: string;

  beforeEach(async () => {
    await resetDb();
    loanId = await addLoan();
  });
  afterAll(() => prisma.$disconnect());

  describe("POST /loan-payment/add", () => {
    it("creates a payment", async () => {
      const res = await addPayment({
        userId: USER_A,
        loanId,
        amount: 250,
        date: "1767312000",
        note: "first",
      });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        loanId,
        userId: USER_A,
        amount: 250,
        date: "1767312000",
        note: "first",
      });
      expect(Object.keys(res.body).sort()).toEqual(
        ["amount", "created", "date", "id", "loanId", "note", "updated", "userId"]
      );
    });

    it("defaults note to null", async () => {
      const res = await addPayment({
        userId: USER_A,
        loanId,
        amount: 1,
        date: "1767312000",
      });
      expect(res.body.note).toBeNull();
    });

    it("allows paying more than the remaining balance and never settles", async () => {
      const res = await addPayment({
        userId: USER_A,
        loanId,
        amount: 5000,
        date: "1767312000",
      });
      expect(res.status).toBe(201);
      const loans = await request(app).get(`/api/v0/loan/${USER_A}`);
      expect(loans.body[0].settledAt).toBeNull();
    });

    it.each([0, -5, "abc", null, ""])("rejects amount %p", async (amount) => {
      const res = await addPayment({
        userId: USER_A,
        loanId,
        amount,
        date: "1767312000",
      });
      expect(res.status).toBe(400);
    });

    it("rejects a missing date", async () => {
      const res = await addPayment({ userId: USER_A, loanId, amount: 1 });
      expect(res.status).toBe(400);
    });

    it("rejects an unknown loanId", async () => {
      const res = await addPayment({
        userId: USER_A,
        loanId: "6f1c1f3e-8f4b-4c1e-9a52-3b7f5f3c2a10",
        amount: 1,
        date: "1767312000",
      });
      expect(res.status).toBe(404);
    });

    it("rejects a deleted loan", async () => {
      await request(app).delete(`/api/v0/loan/${loanId}`);
      const res = await addPayment({
        userId: USER_A,
        loanId,
        amount: 1,
        date: "1767312000",
      });
      expect(res.status).toBe(404);
    });

    it("rejects a malformed loanId", async () => {
      const res = await addPayment({
        userId: USER_A,
        loanId: "not-a-uuid",
        amount: 1,
        date: "1767312000",
      });
      expect(res.status).toBe(400);
    });

    it("rejects a payment on another user's loan", async () => {
      const res = await addPayment({
        userId: USER_B,
        loanId,
        amount: 1,
        date: "1767312000",
      });
      expect(res.status).toBe(401);
    });

    it("rejects a request without userId", async () => {
      const res = await addPayment({ loanId, amount: 1, date: "1767312000" });
      expect(res.status).toBe(401);
    });
  });

  describe("GET /loan-payment/:userId", () => {
    it("returns all of the user's payments across loans, and nobody else's", async () => {
      const otherLoan = await addLoan();
      const bLoan = await addLoan(USER_B);
      await addPayment({ userId: USER_A, loanId, amount: 1, date: "1767312000" });
      await addPayment({ userId: USER_A, loanId: otherLoan, amount: 2, date: "1767312000" });
      await addPayment({ userId: USER_B, loanId: bLoan, amount: 3, date: "1767312000" });

      const res = await request(app).get(`/api/v0/loan-payment/${USER_A}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body.map((p: any) => p.amount).sort()).toEqual([1, 2]);
    });

    it("returns an empty list when there are none", async () => {
      const res = await request(app).get(`/api/v0/loan-payment/${USER_B}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("PUT /loan-payment/:id", () => {
    let paymentId: string;
    beforeEach(async () => {
      const res = await addPayment({
        userId: USER_A,
        loanId,
        amount: 100,
        date: "1767312000",
        note: "orig",
      });
      paymentId = res.body.id;
    });

    it("updates only the fields sent", async () => {
      const res = await request(app)
        .put(`/api/v0/loan-payment/${paymentId}`)
        .send({ id: paymentId, userId: USER_A, amount: 150 });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: paymentId,
        amount: 150,
        date: "1767312000",
        note: "orig",
      });
    });

    it("updates date and clears note", async () => {
      const res = await request(app)
        .put(`/api/v0/loan-payment/${paymentId}`)
        .send({ id: paymentId, userId: USER_A, date: "1767398400", note: null });
      expect(res.body.date).toBe("1767398400");
      expect(res.body.note).toBeNull();
    });

    it("rejects a non-positive amount", async () => {
      const res = await request(app)
        .put(`/api/v0/loan-payment/${paymentId}`)
        .send({ id: paymentId, userId: USER_A, amount: 0 });
      expect(res.status).toBe(400);
    });

    it("rejects another user", async () => {
      const res = await request(app)
        .put(`/api/v0/loan-payment/${paymentId}`)
        .send({ id: paymentId, userId: USER_B, amount: 1 });
      expect(res.status).toBe(401);
    });

    it("404s on an unknown payment", async () => {
      const res = await request(app)
        .put("/api/v0/loan-payment/6f1c1f3e-8f4b-4c1e-9a52-3b7f5f3c2a10")
        .send({ userId: USER_A, amount: 1 });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /loan-payment/:id", () => {
    let paymentId: string;
    beforeEach(async () => {
      const res = await addPayment({
        userId: USER_A,
        loanId,
        amount: 100,
        date: "1767312000",
      });
      paymentId = res.body.id;
    });

    it("deletes the payment", async () => {
      const res = await request(app)
        .delete(`/api/v0/loan-payment/${paymentId}`)
        .query({ userId: USER_A });
      expect(res.status).toBe(200);
      const list = await request(app).get(`/api/v0/loan-payment/${USER_A}`);
      expect(list.body).toEqual([]);
    });

    it("rejects another user", async () => {
      const res = await request(app)
        .delete(`/api/v0/loan-payment/${paymentId}`)
        .query({ userId: USER_B });
      expect(res.status).toBe(401);
      expect(await prisma.loanPayment.count()).toBe(1);
    });
  });

  it("deleting a loan removes its payments", async () => {
    const keepLoan = await addLoan();
    await addPayment({ userId: USER_A, loanId, amount: 1, date: "1767312000" });
    await addPayment({ userId: USER_A, loanId, amount: 2, date: "1767312000" });
    await addPayment({ userId: USER_A, loanId: keepLoan, amount: 3, date: "1767312000" });

    const res = await request(app).delete(`/api/v0/loan/${loanId}`);
    expect(res.status).toBe(200);

    const list = await request(app).get(`/api/v0/loan-payment/${USER_A}`);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].loanId).toBe(keepLoan);
  });
});
