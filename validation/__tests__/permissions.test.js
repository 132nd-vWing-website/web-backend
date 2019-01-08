const permissions = require("../access/permissions");

// This function mocks the
const mockRes = {
  status: status => {
    return { ...status, json: data => data };
  }
};

// Basically, if this function gets run - then permissions are ok
const mockNext = () => {
  status: 200;
};

describe("Permissions.js", () => {
  it("Should throw an error if the required role is not present", () => {
    const mockReq = { user: { roles: [] } };

    const fakeTry = permissions("somerole");
    const res = fakeTry(mockReq, mockRes, mockNext);
    expect(res).toEqual({ access: "User has insufficient permissions" });
  });

  it("Should throw an error if the required role is not present, but some role is", () => {
    const mockReq = { user: { roles: ["foo", "bar"] } };

    const fakeTry = permissions("somerole");
    const res = fakeTry(mockReq, mockRes, mockNext);
    expect(res).toEqual({ access: "User has insufficient permissions" });
  });

  it("Should pass if the the required role is granted", () => {
    const mockReq = { user: { roles: ["somerole"] } };

    const test = permissions("somerole");
    const res = test(mockReq, mockRes, mockNext);
    expect(res).toEqual(undefined);
  });
});
