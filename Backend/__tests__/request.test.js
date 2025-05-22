const request = require("supertest");
const { app, startServer, stopServer } = require("../server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Service = require("../models/services");
const ServiceRequest = require("../models/request");

const token = jwt.sign({ id: "67de61ba0d1c90eb9d13fd01" }, process.env.JWT_SECRET);
const providerToken = jwt.sign({ id: "67e53114826864d8c3339f95" }, process.env.JWT_SECRET);
let requestId = null;

beforeAll(async () => {
  await stopServer();
  await startServer();
}, 10000);

afterAll(async () => {
  await mongoose.connection.close();
  await stopServer();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Service.deleteMany({});
  await ServiceRequest.deleteMany({});

  // Create test users
  const testUser = new User({
    _id: "67de61ba0d1c90eb9d13fd01",
    username: "hemambika",
    fullName: "Hemambika Reddy",
    email: "hemambikabanda071@gmail.com",
    roles: ["customer"],
  });

  const testProvider = new User({
    _id: "67e53114826864d8c3339f95",
    username: "Sara",
    fullName: "Sara Chauhan",
    email: "sara@example.com",
    roles: ["serviceProvider"],
  });

  await testUser.save();
  await testProvider.save();

  // Create a test service
  const testService = new Service({
    _id: "67e53e5f4a2a025d7ff106eb",
    user: "67e53114826864d8c3339f95",
    serviceCategory: "67e44c393273696a2db436e8",
    loc: "Mumbai",
    reminder: false,
    time: { start: "18:30", end: "20:30" },
  });

  await testService.save();

  // Create a test request
  const testRequest = new ServiceRequest({
    requestingUser: "67de61ba0d1c90eb9d13fd01",
    agent: "67e53114826864d8c3339f95",
    service: "67e53e5f4a2a025d7ff106eb", // ✅ Use ObjectId, not string
    status: "pending",
    timeSlot: { start: "10:00", end: "12:00" },
  });

  const savedRequest = await testRequest.save();
  requestId = savedRequest._id;
});

describe("Service Request API Tests", () => {
  it("should fetch service requests made by the user", async () => {
    const res = await request(app)
      .get("/request/my-requests") // ✅ Fixed route name
      .set("Cookie", `token=${token}`);

    console.log("🔍 User Requests Response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  }, 10000);

  it("should create a new service request", async () => {
    const newRequest = {
      agentId: "67e53114826864d8c3339f95",
      serviceId: "67e53e5f4a2a025d7ff106eb",
      status: "pending",
      timeSlot: "14:00 - 16:00", // ✅ Fixed format
    };

    const res = await request(app)
      .post("/request/book-service") // ✅ Fixed route name
      .set("Cookie", `token=${token}`)
      .send(newRequest);

    console.log("🔍 Create Request Response:", res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  }, 10000);

  it("should update a service request status", async () => {
    const updatedStatus = { status: "accepted", serviceid: requestId };

    const res = await request(app)
      .put("/request/update-status") // ✅ Fixed route name
      .set("Cookie", `token=${providerToken}`)
      .send(updatedStatus);

    console.log("🔍 Update Request Response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.request.status).toBe("accepted");
  }, 10000);
});
