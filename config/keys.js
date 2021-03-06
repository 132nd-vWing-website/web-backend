/* eslint global-require: 0 */
// if (process.env.NODE_ENV === 'production') {
//   module.exports = require('./keys_prod');
// } else if (process.env.NODE_ENV === 'test') {
//   module.exports = require('./keys_test');
// } else {
//   module.exports = require('./keys_dev');
// }

if (process.env.NODE_ENV !== 'production') {
  module.exports = require('./keys_dev');
} else {
  module.exports = require('./keys_prod');
}
