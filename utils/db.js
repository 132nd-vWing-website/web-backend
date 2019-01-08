/** Exports a pooled connection to the MySQL database  */
var mysql = require("mysql");

const credentials = require("../config/keys").mySQL;

var db_pool = mysql.createPool(credentials);

/**
 * @desc A helper function for handling DB connections to the SQL database
 * @param {*} req - This would be your DB query
 * @param {*} callback - Callback function - Pass in 'err' and 'rows'
 */
module.exports = (req, callback) => {
  db_pool.getConnection((err, conn) => {
    if (err) {
      callback({ code: 100, status: "Error in connection database" }, null);
      return;
    }

    console.log("MYSQL: Connected as id " + conn.threadId);

    console.log("MYSQL QUERY: %s", req);

    conn.query(req, (err, rows) => {
      conn.release();
      if (!err) {
        callback(null, rows);
      }
    });

    conn.on("error", function(err) {
      callback({ code: 100, status: "Error in connection database" }, null);
      return;
    });
  });
};
