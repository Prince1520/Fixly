const request = require("supertest");
const { app, startServer, stopServer } = require("../server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const token = jwt.sign({ id: "67de61ba0d1c90eb9d13fd01" }, process.env.JWT_SECRET);

beforeAll(async () => {
  await stopServer(); // Stop previous instances
  await startServer(); // Start a fresh instance
}, 10000);

afterAll(async () => {
  await mongoose.connection.close();
  await stopServer();
});

beforeEach(async () => {
  await User.deleteMany({}); // Clear old users

  // Seed test user
  const testUser = new User({
    _id: "67de61ba0d1c90eb9d13fd01",
    username: "hemambika",
    fullName: "hemambika reddy",
    email: "hemambikabanda071@gmail.com",
  });
  await testUser.save();
});

describe("Users API Tests", () => {
  it("should fetch the user profile", async () => {
    const res = await request(app)
      .get("/dashboard/profile")
      .set("Cookie", `token=${token}`);

    console.log("🔍 User Profile Response:", res.body); // Debugging log
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "hemambikabanda071@gmail.com");
  }, 10000);
});
