const express = require('express');

// Initialize the router
const router = express.Router();

// MySQL Connection
const sql = require('../../utils/db');

/* SEE http://apidocjs.com/ for parameters! */

/**
 * @apiversion 0.1.0
 * @api {get} /api/v1/airfields Test endpoint
 * @apiName test-public
 * @apiGroup Airfields (Public)
 *
 * @apiSuccess {string} metadata.msg as a string with an OK message
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Airfields Works!"
 *     }
 */
router.get('/test', (req, res) => res.json({ msg: 'Airfields Works!' }));

/**
 * @apiversion 0.1.0
 * @api {get} /api/v1/airfields Get all airfields
 * @apiName get-airfields-public
 * @apiGroup Airfields (Public)
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
router.get('/', (req, res) => {
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

/**
 * @apiversion 0.1.0
 * @api {get} /api/v1/airfields:id Get an airfields by its ID or ICAO code
 * @apiName get-airfields-by-id-or-icao-public
 * @apiGroup Airfields (Public)
 *
 * @apiParam {string} id ID of airfield to retrieve
 * @apiParam {string} icao ICAO code of airfield to retrieve
 *
 *
 *
 * @apiSuccess {array} metadata as array of objects, containing the airfield
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         [
 *             {
 *                 "airfield_id": 39,
 *                 "af_icao": "XRMF",
 *                 "af_name": "MOZDOK",
 *                 "af_rwy": "8",
 *                 "af_ils": "-",
 *                 "af_gnd": 137.1,
 *                 "af_twr": 137.2,
 *                 "af_ctrl": null,
 *                 "af_mag": "82",
 *                 "af_elev": 508,
 *                 "af_rwy_length": 10235,
 *                 "af_tcn": "-",
 *                 "af_theater_id": 1
 *             },
 *             {
 *                 (... more if ICAO was used, and the airfield has several runways)
 *             }
 *         ]
 *    }
 */

router.get('/airfield', (req, res) => {
  let query;
  if (req.query.id) {
    query = `SELECT * FROM list_airfields WHERE airfield_id=${req.query.id}`;
  } else if (req.query.icao) {
    query = `SELECT * FROM list_airfields WHERE af_icao="${req.query.icao}"`;
  } else {
    res.json({ code: 400, status: 'Bad Request: Airfield ID or ICAO not passed' });
  }

  sql(query).then((data) => {
    if (data.error) res.json(data);
    res.json(data.rows);
  });
});

module.exports = router;
