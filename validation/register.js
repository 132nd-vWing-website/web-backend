const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  const errors = {};

  // Ensure we have non-empty values for required fields, even if that value was not passed
  data.callsign = !isEmpty(data.callsign) ? data.callsign : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // Testing:Callsign
  if (!Validator.isLength(data.callsign, { min: 2, max: 30 })) {
    errors.callsign = 'Callsign must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.callsign)) {
    errors.callsign = 'Callsign field is required';
  }

  // Testing:Email
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Testing:Password
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Testing:Password2
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};
