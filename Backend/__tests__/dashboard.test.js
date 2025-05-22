const request = require("supertest");
const { app, startServer, stopServer } = require("../server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const ServiceRequest = require("../models/request");
const Service = require("../models/services");

const token = jwt.sign({ id: "67de61ba0d1c90eb9d13fd01" }, process.env.JWT_SECRET);

beforeAll(async () => {
  await stopServer(); // Stop any running instance
  await startServer(); // Start fresh
}, 10000); // Timeout increased to 10s

afterAll(async () => {
  await mongoose.connection.close();
  await stopServer();
});

beforeEach(async () => {
  await User.deleteMany({});
  await ServiceRequest.deleteMany({});
  await Service.deleteMany({});

  const testUser = new User({
    _id: "67de61ba0d1c90eb9d13fd01",
    username: "hemambika",
    fullName: "Hemambika Reddy",
    email: "hemambikabanda071@gmail.com",
    roles: ["customer"],
  });
  await testUser.save();

  const testService = new Service({
    user: "67de61ba0d1c90eb9d13fd01",
    serviceCategory: "67e44c393273696a2db436e7",
    loc: "Mumbai",
    reminder: false,
    time: { start: "09:00", end: "17:00" },
  });
  await testService.save();

  const testRequest = new ServiceRequest({
      requestingUser: "67de61ba0d1c90eb9d13fd01",
      service: "67e44c393273696a2db436e7",
      agent: "67de61ba0d1c90eb9d13fd02",
      status: "pending",
      timeSlot: { start: "10:00", end: "12:00" } // ✅ Added timeSlot to fix the error
    });
    await testRequest.save();
});

// ✅ Test 1: Fetch Quick Stats
describe("GET /dashboard/quick-stats", () => {
  it("should return quick stats for the logged-in user", async () => {
    const res = await request(app)
      .get("/dashboard/quick-stats")
      .set("Cookie", `token=${token}`);

    console.log("📊 Quick Stats Response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.totalRequestsSent).toBe(1);
  }, 10000);
});

// ✅ Test 2: Fetch User Requests
describe("GET /dashboard/user-requests", () => {
  it("should return service requests made by the user", async () => {
    const res = await request(app)
      .get("/dashboard/user-requests")
      .set("Cookie", `token=${token}`);

    console.log("📜 User Requests Response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);
});

// ✅ Test 3: Fetch Service Provider Requests
describe("GET /dashboard/requests", () => {
  it("should return service requests assigned to the provider", async () => {
    const res = await request(app)
      .get("/dashboard/requests")
      .set("Cookie", `token=${token}`);

    console.log("🔄 Service Provider Requests Response:", res.body);
    expect(res.statusCode).toBe(200);
  }, 10000);
});

// ✅ Test 4: Fetch User Profile
describe("GET /dashboard/profile", () => {
  it("should return the user's profile details", async () => {
    const res = await request(app)
      .get("/dashboard/profile")
      .set("Cookie", `token=${token}`);

    console.log("👤 Profile Response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("hemambikabanda071@gmail.com");
  }, 10000);
});
