const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // Ensure we have non-empty values for required fields, even if that value was not passed
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Testing:Password
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  // Testing:Email
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  return {
    isValid: isEmpty(errors),
    errors
  };
};
