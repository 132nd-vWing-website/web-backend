const parseJwt = require("../parseJwt");

const _TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNDY2NjcyNGQxZWVmMGE0NDBkYzY2OCIsIm5hbWUiOiJCZW4gRG92ZXIiLCJhdmF0YXIiOiIiLCJyb2xlcyI6WyJjb21tYW5kIiwiaW5zdHJ1Y3RvciIsIjEzMm5kIiwiNDk0dGgiXSwiaWF0IjoxNTMxODY4MDIyLCJleHAiOjE1MzE4NzE2MjJ9.Hfyg_XH7AiHA8nbiY9hOdGhQK5EELL495THC5Rzktks";

describe("parseJWT.js", () => {
  it("Should be able to decode a JWT token", () => {
    const res = parseJwt(_TOKEN);
    expect(res).toEqual({
      id: "5b4666724d1eef0a440dc668",
      name: "Ben Dover",
      avatar: "",
      roles: ["command", "instructor", "132nd", "494th"],
      iat: 1531868022,
      exp: 1531871622
    });
  });

  it("Should return an error if missing token", () => {
    const res = parseJwt(null);
    expect(res).toEqual({ error: "no valid token defined" });
  });

  it("Should return an error if token is empty", () => {
    const res = parseJwt("");
    expect(res).toEqual({ error: "no valid token defined" });
  });

  it("Should return an error if token is undefined", () => {
    const res = parseJwt();
    expect(res).toEqual({ error: "no valid token defined" });
  });

  it("Should return an error if token is not a string", () => {
    const res = parseJwt(1234);
    expect(res).toEqual({ error: "no valid token defined" });
  });
});
