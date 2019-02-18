/** Exports a pooled connection to the MySQL database  */
const mysql = require('mysql');

const credentials = require('../config/keys').mySQL;

const dbPool = mysql.createPool(credentials);

/**
 * Promise-based MySQL query
 * @desc A helper function for handling DB connections to the SQL database
 * @param {string} req - This would be your sql query
 * @returns {object} - returns an object containing either error or rows
 * @example sql(query).then(data => console.log(data))
 */
module.exports = (req) =>
  new Promise((res) => {
    dbPool.getConnection((err, conn) => {
      if (err) {
        res({ error: { code: 100, status: 'Error in connection to database' } });
      }

      if (conn) {
        console.log(`MYSQL: Connected as id ${conn.threadId}`);
        console.log('MYSQL QUERY: %s', req);

        conn.query(req, (_err, rows) => {
          conn.release();
          if (!_err) {
            res({ rows });
          }
        });
      } else {
        console.log(`MYSQL: Connection failed!`);
      }
    });
  });

/** OLD CODE! */
// module.exports = (req, callback) => {
//   dbPool.getConnection((err, conn) => {
//     if (err) {
//       callback({ code: 100, status: 'Error in connection database' }, null);
//       return;
//     }

//     console.log(`MYSQL: Connected as id ${conn.threadId}`);

//     console.log('MYSQL QUERY: %s', req);

//     conn.query(req, (_err, rows) => {
//       conn.release();
//       if (!_err) {
//         callback(null, rows);
//       }
//     });

//     conn.on('error', () => {
//       callback({ code: 100, status: 'Error in connection database' }, null);
//     });
//   });
// };
