/** Exports a pooled connection to the MySQL database  */
const mysql = require('mysql');

const credentials = require('../config/keys').mySQL;

const dbPool = mysql.createPool(credentials);

/**
 * @desc A helper function for handling DB connections to the SQL database
 * @param {*} req - This would be your DB query
 * @param {*} callback - Callback function - Pass in 'err' and 'rows'
 */
module.exports = (req, callback) => {
  dbPool.getConnection((err, conn) => {
    if (err) {
      callback({ code: 100, status: 'Error in connection database' }, null);
      return;
    }

    console.log(`MYSQL: Connected as id ${conn.threadId}`);

    console.log('MYSQL QUERY: %s', req);

    conn.query(req, (_err, rows) => {
      conn.release();
      if (!_err) {
        callback(null, rows);
      }
    });

    conn.on('error', () => {
      callback({ code: 100, status: 'Error in connection database' }, null);
    });
  });
};
