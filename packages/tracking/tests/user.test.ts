import { prisma, resetDb, USER_A } from "./helpers";
import request from "supertest";
import app from "@tracking/app";

describe("user carry over setting", () => {
  beforeEach(resetDb);
  afterAll(() => prisma.$disconnect());

  it("defaults to off", async () => {
    const res = await request(app).get(`/api/v0/user/${USER_A}`);
    expect(res.status).toBe(200);
    expect(res.body.carryOverEnabled).toBe(false);
  });

  it("is returned by /user/add for an existing user", async () => {
    await prisma.user.update({
      where: { userId: USER_A },
      data: { carryOverEnabled: true },
    });
    const res = await request(app).post("/api/v0/user/add").send({
      userId: USER_A,
      name: USER_A,
      email: `${USER_A}@example.com`,
      profilePicture: "pic",
    });
    expect(res.status).toBe(201);
    expect(res.body.carryOverEnabled).toBe(true);
  });

  it("can be turned off and on without touching other fields", async () => {
    const off = await request(app)
      .put(`/api/v0/user/${USER_A}`)
      .send({ userId: USER_A, carryOverEnabled: false });
    expect(off.status).toBe(200);
    expect(off.body).toMatchObject({ carryOverEnabled: false, name: USER_A });

    const on = await request(app)
      .put(`/api/v0/user/${USER_A}`)
      .send({ userId: USER_A, carryOverEnabled: true });
    expect(on.body.carryOverEnabled).toBe(true);
  });

  it("rejects a non-boolean value", async () => {
    const res = await request(app)
      .put(`/api/v0/user/${USER_A}`)
      .send({ userId: USER_A, carryOverEnabled: "no" });
    expect(res.status).toBe(400);
    const user = await prisma.user.findUnique({ where: { userId: USER_A } });
    expect(user?.carryOverEnabled).toBe(false);
  });
});
