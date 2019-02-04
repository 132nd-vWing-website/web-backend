const express = require('express');

// Initialize the router
const router = express.Router();

// MySQL Connection
const sql = require('../../utils/db');

/* SEE http://apidocjs.com/ for parameters! */

/**
 * @apiversion 0.1.0
 * @api {get} /api/v1/lists/test Test endpoint
 * @apiName test-lists-public
 * @apiGroup Lists (Public)
 *
 * @apiSuccess {string} metadata.msg as a string with an OK message
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Lists Works!"
 *     }
 */
router.get('/test', (req, res) => res.json({ msg: 'Lists Works!' }));

/**
 * @apiversion 0.1.0
 * @api {get} /api/v1/lists/airfields Get all airfields
 * @apiName get-lists-airfields-public
 * @apiGroup lists (Public)
 *
 * @apiSuccess {array} metadata as array of objects, containing all airfields
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         [
 *           {
 *             "airfield_id": 39,
 *             "af_icao": "XRMF",
 *             "af_name": "MOZDOK",
 *             "af_rwy": "8",
 *             "af_ils": "-",
 *             "af_gnd": 137.1,
 *             "af_twr": 137.2,
 *             "af_ctrl": null,
 *             "af_mag": "82",
 *             "af_elev": 508,
 *             "af_rwy_length": 10235,
 *             "af_tcn": "-",
 *             "af_theater_id": 1
 *           },
 *           {
 *            ...etc
 *          },
 *       ]
 *    }
 */
router.get('/airfields', (req, res) => {
  // Default value if limit is not passed
  // let limit = 'LIMIT 0, 50';
  let limit = '';
  if (req.query.limit) limit = `LIMIT 0, ${req.query.limit}`;

  let desc = '';
  if (req.query.desc !== 'false') desc = `ORDER BY af_icao DESC`;

  const query = `SELECT * from list_airfields ${desc} ${limit}`;
  sql(query).then((data) => {
    if (data.error) res.json(data);
    res.json(data.rows);
  });
});

module.exports = router;
