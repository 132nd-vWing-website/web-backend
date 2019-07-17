const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  const errors = {};

  console.log(data);

  // Ensure we have non-empty values for required fields, even if that value was not passed
  data.inventory = !isEmpty(data.inventory) ? data.inventory : '';

  // Testing:Inventory
  if (Validator.isEmpty(data.inventory)) {
    errors.inventory = 'No inventory data passed';
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};
