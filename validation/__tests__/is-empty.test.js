const isEmpty = require("../is-empty");

describe("The function is-empty", () => {
  it("Should return TRUE if value is undefined", () => {
    expect(isEmpty()).toBe(true);
  });

  it("Should return TRUE if value is null", () => {
    expect(isEmpty(null)).toBe(true);
  });

  it("Should return TRUE if value is an empty object", () => {
    expect(isEmpty({})).toBe(true);
  });

  it("Should return TRUE if value is a empty array", () => {
    expect(isEmpty([])).toBe(true);
  });

  it("Should return TRUE if value is an empty string", () => {
    expect(isEmpty("")).toBe(true);
  });

  it("Should return FALSE if value is an non-empty string", () => {
    expect(isEmpty("foo")).toBe(false);
    expect(isEmpty("f")).toBe(false);
  });

  it("Should return FALSE if value is an integer", () => {
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty(99999)).toBe(false);
  });

  it("Should return FALSE if value is a object with keys", () => {
    expect(isEmpty({ foo: "bar" })).toBe(false);
    expect(isEmpty({ foo: "bar", bar: "foo" })).toBe(false);
  });

  it("Should return TRUE if value is a array with values", () => {
    expect(isEmpty(["foo"])).toBe(false);
    expect(isEmpty(["foo", "bar"])).toBe(false);
  });
});
