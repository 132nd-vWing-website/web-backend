const express = require('express');

// Initialize the router
const router = express.Router();

// MySQL Connection
const sql = require('../../utils/db');

/* SEE http://apidocjs.com/ for parameters! */

/**
 * @apiversion 0.1.0
 * @api {get} /api/v1/ato Test endpoint
 * @apiName test-public
 * @apiGroup Air Tasking Order (Public)
 *
 * @apiSuccess {string} metadata.msg as a string with an OK message
 */
router.get('/test', (req, res) => res.json({ msg: 'ATO endpoint works!' }));

/**
 * @apiversion 0.1.0
 * @api {get} /api/v1/ato/missions Get all Mission Types
 * @apiName get-mission-types-public
 * @apiGroup Air Tasking Order (Public)
 *
 * @apiSuccess {array} metadata as array of objects, containing all mission typess
 */
router.get('/missions', (req, res) => {
  const query = `SELECT * from list_msntypes ORDER BY type_identifier DESC`;
  sql(query).then((data) => {
    if (data.error) res.json(data);
    res.json(data.rows);
  });
});

module.exports = router;
