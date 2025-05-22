const request = require("supertest");
const { app, startServer, stopServer } = require("../server");

beforeAll(async () => {
  await stopServer(); // ✅ Ensure no previous instance is running
  await startServer(); // ✅ Start fresh
});

afterAll(async () => {
  await stopServer(); // ✅ Properly close server & DB
});

describe("Feedback API Tests", () => {
  it("should return 200 for GET /feedback", async () => {
    const res = await request(app).get("/feedback");
    expect(res.statusCode).toBe(200);
  }, 10000); // ✅ Increased timeout
});
