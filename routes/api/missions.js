const express = require('express');

// Initialize the router
const router = express.Router();

// MySQL Connection
const sql = require('../../utils/db');

/**
 * @route GET api/v1/missions/test
 * @desc Tests the events route
 * @access Public
 */
router.get('/test', (req, res) => res.json({ msg: 'Missions Work!' }));

/**
 * @route GET api/v1/missions/all
 * @desc Retrieves all missions. Option to pass limit (defaults to 50) and desc (defaults to true) as URL query strings
 * @access Public
 *
 * @example localhost:5000/api/missions/all?limit=100&desc=false
 *
 * @param {string} limit - Number of records to return
 * @param {bool} desc - List will be returned sorted by DESC unless this is false
 */
router.get('/all', (req, res) => {
  // Default value if limit is not passed
  let limit = 'LIMIT 0, 50';
  if (req.query.limit) limit = `LIMIT 0, ${req.query.limit}`;

  let desc = '';
  if (req.query.desc !== 'false') desc = `ORDER BY msn_id DESC`;

  const query = `SELECT * from msn ${desc} ${limit}`;
  sql(query).then((data) => {
    if (data.error) res.json(data);
    res.json(data.rows);
  });
});

/**
 * @route GET api/missions/mission
 * @desc Retrieves a spessific mission based and briefing on the passed ID (as URL query)
 * @access Public
 *
 * @example localhost:5000/api/missions/mission?id=115
 *
 * @param {string} id - ID of mission to return
 */
router.get('/mission', (req, res) => {
  if (!req.query.id) res.json({ code: 400, status: 'Bad Request: Mission id not passed' });

  const query = `SELECT a.*, b.* FROM msn a JOIN msn_briefing b ON b.msn_id = a.msn_id WHERE a.msn_id=${
    req.query.id
  }`;

  sql(query).then((data) => {
    if (data.error) res.json(data);
    res.json(data.rows);
  });
});

module.exports = router;
