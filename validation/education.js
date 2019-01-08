const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  // Ensure we have non-empty values for required fields, even if that value was not passed
  data.school = !isEmpty(data.school) ? data.school : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "School field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From field is required";
  }

  return {
    isValid: isEmpty(errors),
    errors
  };
};
