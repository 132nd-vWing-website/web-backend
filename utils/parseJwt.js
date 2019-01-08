/**
 * Decodes a JWT token
 * @param {string} token 
 */

module.exports = token => {
  if (
    token === null ||
    token === "" ||
    typeof token === undefined ||
    typeof token !== "string"
  ) {
    return { error: "no valid token defined" };
  }

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
