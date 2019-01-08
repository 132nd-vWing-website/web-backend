const request = require("supertest");
const app = require("../../../src/app");

describe("Events API Endpoint", () => {
  describe("/api/events/test", () => {
    it("Should give a status 200 and a message", async () => {
      const res = await request(app).get("/api/events/test");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("msg");
    });
  });
});
