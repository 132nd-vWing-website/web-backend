const request = require("supertest");
const app = require("../../../src/app");

const mongoose = require("mongoose");
const Post = require("../../../models/Post");
const User = require("../../../models/User");
const Profile = require("../../../models/Profile");

const parseJwt = require("../../../utils/parseJwt");

describe("NOTAMs API Endpoint", () => {
  // GLOBALS
  let _TOKEN = "";
  let _ID = "";

  // Clear the test database schema before we start, and create+login a user
  beforeAll(async () => {
    await Post.remove({});
    await User.remove({});
    await Profile.remove({});

    // Create a fake user for use during these tests
    const createUser = await request(app)
      .post("/api/users/register")
      .send({
        name: "NOTAMs Test User",
        email: "some@mail.com",
        password: "123123",
        password2: "123123",
        status: "Active"
      });

    // Log the fake user in
    const login = await request(app)
      .post("/api/users/login")
      .send({
        email: "some@mail.com",
        password: "123123"
      });

    // Store some data for manipulation during tests
    _TOKEN = login.body.token;
    _ID = parseJwt(_TOKEN).id;

    // Create a profile for our test user in order to store unread NOTAMs
    await request(app)
      .post("/api/profile/")
      .set({ Authorization: _TOKEN })
      .send({ user: _ID, handle: "testuser", status: "Active" });
  });

  // Empty and close the DB connection once we are done
  afterAll(async () => {
    await Post.remove({});
    await User.remove({});
    await Profile.remove({});
    await mongoose.connection.close();
  });

  describe("The path /api/notams/test", () => {
    it("should give us status 200 and a message", async () => {
      const res = await request(app).get("/api/notams/test");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("msg");
    });
  });

  describe("The path /api/notams", () => {
    it("should require the role 'command' in order to post", async () => {
      const newPost = new Post({
        type: "notam",
        title: "Some Notam Title",
        text: "Some very exiting text"
      });

      const res = await request(app)
        .post("/api/notams")
        .set({ Authorization: _TOKEN });
      expect(res.statusCode).toBe(401);
    });

    it("should be able to create a NOTAM when role has been granted", async () => {
      // Add the required role to the user
      await User.findById(_ID)
        .then(user => {
          user.roles = ["command"];
          user.save();
        })
        .catch(err => console.log(err.message));

      const newPost = new Post({
        type: "notam",
        title: "Some Notam Title",
        text: "Some very exiting text"
      });

      const res = await request(app)
        .post("/api/notams")
        .set({ Authorization: _TOKEN })
        .send(newPost);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("The path /api/notams/unread", () => {
    it("should return all unread notams for the logged in user", async () => {
      const res = await request(app)
        .get("/api/notams/unread")
        .set({ Authorization: _TOKEN });
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("The path /api/notams/:id", () => {
    it("should delete the notam passed as id", async () => {
      let post_id;
      // Get the post we created above...
      await Post.find()
        .then(posts => (post_id = posts[0]._id))
        .catch(err => console.log(err));

      // ...and try to delete it
      const res = await request(app)
        .delete(`/api/notams/${post_id}`)
        .set({ Authorization: _TOKEN });

      expect(res.statusCode).toBe(200);
    });
  });
});
