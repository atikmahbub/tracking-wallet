import { prisma, resetDb, USER_A } from "./helpers";
import request from "supertest";
import app from "@tracking/app";

const loanBody = {
  userId: USER_A,
  name: "Rahim",
  amount: 1000,
  note: "lunch",
  deadLine: "1767225600",
  loanType: 1,
};

const addLoan = (body: object = {}) =>
  request(app)
    .post("/api/v0/loan/add")
    .send({ ...loanBody, ...body });

// Full PUT body as current app versions send it (no settledAt key).
const legacyPut = (id: string, body: object = {}) =>
  request(app)
    .put(`/api/v0/loan/${id}`)
    .send({
      id,
      name: "Rahim",
      amount: 1200,
      note: "lunch",
      deadLine: "1767225600",
      loanType: 1,
      ...body,
    });

describe("loan", () => {
  beforeEach(resetDb);
  afterAll(() => prisma.$disconnect());

  it("creates a loan with the existing contract plus settledAt: null", async () => {
    const res = await addLoan();
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      userId: USER_A,
      name: "Rahim",
      amount: 1000,
      note: "lunch",
      deadLine: "1767225600",
      loanType: 1,
      settledAt: null,
    });
    expect(typeof res.body.id).toBe("string");
    expect(res.body.created).toMatch(/^\d+$/);
    expect(res.body.updated).toMatch(/^\d+$/);
  });

  it("accepts settledAt on add", async () => {
    const res = await addLoan({ settledAt: "1767312000" });
    expect(res.status).toBe(201);
    expect(res.body.settledAt).toBe("1767312000");
  });

  it("rejects a non-numeric settledAt", async () => {
    const res = await addLoan({ settledAt: "yesterday" });
    expect(res.status).toBe(400);
  });

  it("lists the user's loans with settledAt", async () => {
    await addLoan();
    await addLoan({ settledAt: "1767312000" });
    const res = await request(app).get(`/api/v0/loan/${USER_A}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.map((l: any) => l.settledAt).sort()).toEqual([
      "1767312000",
      null,
    ]);
  });

  it("PUT without settledAt keeps the stored value", async () => {
    const { body: loan } = await addLoan({ settledAt: "1767312000" });
    const res = await legacyPut(loan.id);
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(1200);
    expect(res.body.settledAt).toBe("1767312000");
  });

  it("PUT with settledAt sets it", async () => {
    const { body: loan } = await addLoan();
    const res = await legacyPut(loan.id, { settledAt: "1767312000" });
    expect(res.body.settledAt).toBe("1767312000");
  });

  it("PUT with settledAt: null reopens the loan", async () => {
    const { body: loan } = await addLoan({ settledAt: "1767312000" });
    const res = await legacyPut(loan.id, { settledAt: null });
    expect(res.status).toBe(200);
    expect(res.body.settledAt).toBeNull();
  });

  it("deletes a loan", async () => {
    const { body: loan } = await addLoan();
    const res = await request(app).delete(`/api/v0/loan/${loan.id}`);
    expect(res.status).toBe(200);
    const list = await request(app).get(`/api/v0/loan/${USER_A}`);
    expect(list.body).toHaveLength(0);
  });
});
