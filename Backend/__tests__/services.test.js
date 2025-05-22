const request = require("supertest");
const { app, startServer, stopServer } = require("../server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Service = require("../models/services");

const token = jwt.sign({ id: "67de61ba0d1c90eb9d13fd01" }, process.env.JWT_SECRET);

beforeAll(async () => {
  console.log("Stopping server...");
  await stopServer(); // Ensure no previous instance is running
  console.log("Starting server...");
  await startServer(); // Start fresh
  console.log("Server started.");
}, 10000); // Increase timeout to 10 seconds

afterAll(async () => {
  console.log("Closing MongoDB connection...");
  await mongoose.connection.close(); // Close DB connection
  console.log("Stopping server...");
  await stopServer(); // Shutdown server
  console.log("Server stopped.");
});

beforeEach(async () => {
  console.log("Clearing database...");
  await User.deleteMany({});
  await Service.deleteMany({});


  console.log("Seeding database...");
  const testUser = new User({
    _id: "67de61ba0d1c90eb9d13fd01",
    username: "hemambika",
    fullName: "hemambika reddy",
    email: "hemambikabanda071@gmail.com",
    
  });
  await testUser.save();

  const testService = new Service({
    user: "67de61ba0d1c90eb9d13fd01",
    serviceCategory: "67e44c393273696a2db436e7",
    loc: "mumbai",
    reminder: false,
    time: { start: "09:00", end: "17:00" },
  });
  await testService.save();
  console.log("Database seeded.");
});

describe("Services API Tests", () => {
  it("should fetch all services", async () => {
    const res = await request(app)
      .get("/services/my-services")
      .set("Cookie", `token=${token}`); // Add token to the request
    console.log("🔍 Services API Response:", res.body); // Debugging log
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000); // Increase timeout to 10 seconds
});