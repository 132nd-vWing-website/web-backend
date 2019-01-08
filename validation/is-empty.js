/**
 * This function will check for a certain set of criteria, and return true of it is 
 * evaluated as empty
 * @param {string} value 
 */
const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

module.exports = isEmpty;
