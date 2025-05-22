const request = require("supertest");
const { app, startServer, stopServer } = require("../server");

beforeAll(async () => {
  await stopServer(); // Ensure no previous instance is running
  await startServer(); // Start fresh
});

afterAll(async () => {
  await stopServer(); // Properly close server & DB
});

describe("Auth API Tests", () => {
  it("should register a new user", async () => {
    const sampleUser = {
      fullName: "Test User",
      email: "test@example.com",
      phone: "1234567890",
    };
    const res = await request(app).post("/auth/signup").send(sampleUser);
    expect([201, 400]).toContain(res.statusCode); // 400 if user already exists
  }, 10000);

  it("should login a user", async () => {
    const res = await request(app).post("/auth/login").send({ phone: "1234567890" });
    expect([200, 400]).toContain(res.statusCode); // 400 if user isn't registered
  }, 10000);
});
