const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  // Ensure we have non-empty values for required fields, even if that value was not passed
  data.text = !isEmpty(data.text) ? data.text : "";
  data.type = !isEmpty(data.type) ? data.text : "error";

  if (!Validator.isLength(data.text, { min: 10, max: 1000 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "A post type is required";
  }

  return {
    isValid: isEmpty(errors),
    errors
  };
};
