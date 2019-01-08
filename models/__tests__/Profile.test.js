const mongoose = require("mongoose");

// TestDB (Needs to be in your keys_dev.js!)
const testDB = require("../config/keys_test").mongoURI;

mongoose.connect(testDB, { useNewUrlParser: true });

// Schema
const Profile = require("./Profile");

describe("User Model", () => {
  // Clear the test database schema before we start
  beforeAll(async () => {
    await Profile.remove({});
  });

  // Clear the test database between tests
  afterEach(async () => {
    await Profile.remove({});
  });

  // Close the DB connection once we are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("has a model", () => {
    expect(Profile).toBeDefined();
  });

  describe("Get profile", () => {
    it("gets a profile", async () => {
      const testProfile = new Profile({
        handle: "foo",
        status: "active"
      });
      await testProfile.save();
      const foundUser = await Profile.findOne({ handle: "foo" });
      expect(foundUser.handle).toEqual(testProfile.handle);
    });
  });

  describe("Save profile", () => {
    it("saves a profile", async () => {
      const testProfile = new Profile({
        handle: "foo",
        status: "active"
      });
      const savedProfile = await testProfile.save();
      expect(savedProfile.handle).toEqual(testProfile.handle);
    });
  });

  describe("Update profile", () => {
    it("updates a profile", async () => {
      const testProfile = new Profile({
        handle: "foo",
        status: "active"
      });
      await testProfile.save();

      testProfile.handle = "bar";
      const updatedProfile = await testProfile.save();
      expect(updatedProfile.handle).toEqual("bar");
    });
  });
});
