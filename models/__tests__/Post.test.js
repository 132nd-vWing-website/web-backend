const mongoose = require("mongoose");

// TestDB (Needs to be in your keys_dev.js!)
const testDB = require("../config/keys_test").mongoURI;

mongoose.connect(testDB, { useNewUrlParser: true });

// Schema
const Post = require("./Post");

describe("User Model", () => {
  // Clear the test database schema before we start
  beforeAll(async () => {
    await Post.remove({});
  });

  // Clear the test database between tests
  afterEach(async () => {
    await Post.remove({});
  });

  // Close the DB connection once we are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("has a model", () => {
    expect(Post).toBeDefined();
  });

  describe("Get post", () => {
    it("gets a post", async () => {
      const testPost = new Post({
        type: "test-post",
        title: "Some Post Title",
        text: "Some post text"
      });
      await testPost.save();
      const foundPost = await Post.findOne({ type: "test-post" });
      expect(foundPost.type).toEqual(testPost.type);
    });
  });

  describe("Save post", () => {
    it("saves a post", async () => {
      const testPost = new Post({
        type: "test-post",
        title: "Some Post Title",
        text: "Some post text"
      });
      const savedPost = await testPost.save();
      expect(savedPost.type).toEqual(testPost.type);
    });
  });

  describe("Update post", () => {
    it("updates a post", async () => {
      const testPost = new Post({
        type: "test-post",
        title: "Some Post Title",
        text: "Some post text"
      });
      await testPost.save();

      testPost.text = "some brand new text";
      const updatedPost = await testPost.save();
      expect(updatedPost.text).toEqual("some brand new text");
    });
  });
});
