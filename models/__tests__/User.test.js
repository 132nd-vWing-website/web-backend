/* eslint no-undef: 0 */
const mongoose = require('mongoose');

// TestDB (Needs to be in your keys_dev.js!)
const testDB = require('../../config/keys_test').mongoURI;

mongoose.connect(
  testDB,
  { useNewUrlParser: true },
);

// Schema
const User = require('../User');

describe('User Model', () => {
  // Clear the test database schema before we start
  beforeAll(async () => {
    await User.remove({});
  });

  // Clear the test database between tests
  afterEach(async () => {
    await User.remove({});
  });

  // Close the DB connection once we are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('has a model', () => {
    expect(User).toBeDefined();
  });

  describe('Get user', () => {
    it('gets a user', async () => {
      const testUser = new User({
        name: 'foo',
        email: 'test@user.com',
        password: '123456',
      });
      await testUser.save();
      const foundUser = await User.findOne({ name: 'foo' });
      expect(foundUser.name).toEqual(testUser.name);
    });
  });

  describe('Save user', () => {
    it('saves a user', async () => {
      const testUser = new User({
        name: 'foo',
        email: 'test@user.com',
        password: '123456',
      });
      const savedUser = await testUser.save();
      expect(savedUser.name).toEqual(testUser.name);
    });
  });

  describe('Update user', () => {
    it('updates a user', async () => {
      const testUser = new User({
        name: 'foo',
        email: 'test@user.com',
        password: '123456',
      });
      await testUser.save();

      testUser.name = 'bar';
      const updatedUser = await testUser.save();
      expect(updatedUser.name).toEqual('bar');
    });
  });
});
