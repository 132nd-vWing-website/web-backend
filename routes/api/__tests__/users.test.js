const request = require("supertest");
const app = require("../../../src/app");

const mongoose = require("mongoose");
const User = require("../../../models/User");

// A user object used for most of the tests below
const newUser = {
  name: "Some Name",
  email: "some@mail.com",
  password: "123123",
  password2: "123123"
};

describe("Users API Endpoint", () => {
  // Clear the test database schema before we start
  beforeAll(async () => {
    await User.remove({});
  });

  // Make sure all users are removed, and close the DB connection once we are done
  afterAll(async () => {
    await User.remove({});
    await mongoose.connection.close();
  });

  describe("The path /api/users/test", () => {
    it("should give us status 200 and a message", async () => {
      const res = await request(app).get("/api/users/test");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("msg");
    });
  });

  describe("The path /api/users/register", () => {
    // Clear the test database between tests
    afterEach(async () => {
      await User.remove({});
    });

    it("should allow us to register a new user, and return required information on the registered user", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send(newUser);
      expect(res.statusCode).toBe(200);
      expect(
        Object.keys(res.body).includes("_id", "name", "email", "password")
      ).toEqual(true);
    });

    it("should prevent us from using an existing email", async () => {
      const init = await request(app)
        .post("/api/users/register")
        .send(newUser);

      const res = await request(app)
        .post("/api/users/register")
        .send(newUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toHaveProperty("email");
    });

    it("should throw an error if the confirm password doesnt match", async () => {
      const user = {
        name: "Some Name",
        email: "some@mail.com",
        password: "123123",
        password2: "not equal to password"
      };

      const res = await request(app)
        .post("/api/users/register")
        .send(user);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        password2: "Passwords must match"
      });
    });
  });

  describe("The path /api/users/login", () => {
    // We need to store the token between tests to authenticate
    let token;

    it("should allow us to log in", async () => {
      const createUser = await request(app)
        .post("/api/users/register")
        .send(newUser);

      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "some@mail.com", password: "123123" });

      token = res.body.token;
      expect(res.statusCode).toBe(200);
    });

    it("should allow us to get the currently logged in use", async () => {
      const res = await request(app)
        .get("/api/users/current")
        .set({ Authorization: token });
      expect(res.statusCode).toBe(200);
    });
  });
});
