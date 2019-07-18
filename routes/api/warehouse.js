const express = require('express');

// Load input validation
const validateWarehouseInput = require('../../validation/warehouse');

// Initialize the router
const router = express.Router();

// MySQL Connection
const sql = require('../../utils/db');

/**
 * @route GET api/v1/warehouse/test
 * @desc Tests the events route
 * @access Public
 */
router.get('/test', (req, res) => res.json({ msg: 'Warehouse Work!' }));

/**
 * @route GET api/v1/warehouse/all
 * @desc Gets all warehouses, showing their event id and warehouse id. Option to pass limit (defaults to all) and desc (defaults to true) as URL query strings
 * @access Public
 *
 * @example localhost:5000/api/v1/warehouse/all?limit=100&desc=false
 *
 * @param {string} limit - Number of records to return
 * @param {bool} desc - List will be returned sorted by DESC unless this is false
 */
router.get('/all', (req, res) => {
  // Default value if limit is not passed
  let limit = '';
  if (req.query.limit) limit = `LIMIT 0, ${req.query.limit}`;

  let desc = '';
  if (req.query.desc !== 'false') desc = `ORDER BY event_id DESC`;

  const query = `SELECT event_id, warehouse_id from warehouse ${desc} ${limit}`;
  sql(query).then((data) => {
    if (data.error) res.json(data);
    res.json(data.rows);
  });
});

/**
 * @route GET api/warehouse/inventory
 * @desc Retrieves a spessific warehouse inventory, given the warehouse ID passed as URL query
 * @access Public
 *
 * @example localhost:5000/api/warehouse/inventory?id=115
 *
 * @param {string} id - ID of mission to return
 */
// router.get('/inventory', (req, res) => {
router.get('/', (req, res) => {
  if (!req.query.id) res.json({ code: 400, status: 'Bad Request: Warehouse ID not passed' });

  const query = `SELECT inventory FROM warehouse WHERE warehouse_id=${req.query.id}`;

  sql(query).then((data) => {
    console.log(data);
    if (data.error) res.json(data);
    // Should probably add some checking here, to see that we actually get some data returned
    res.json(JSON.parse(data.rows[0].inventory));
    // res.json(data.rows);
  });
});

/**
 * @route GET api/warehouse/event
 * @desc Retrieves a spessific warehouse inventory, given the event ID passed as URL query
 * @access Public
 *
 * @example localhost:5000/api/warehouse/?event=115
 *
 * @param {string} id - ID of mission to return
 */
router.get('/', (req, res) => {
  if (!req.query.event) res.json({ code: 400, status: 'Bad Request: Event ID not passed' });

  const query = `SELECT CAST(inventory AS JSON) FROM warehouse WHERE event_id=${req.query.event}`;

  sql(query).then((data) => {
    if (data.error) res.json(data);
    res.json(data.rows);
  });
});

/**
 * @route POST api/v1/warehouse/?id=12
 * @desc POSTS a new inventory JSON object to a specific warehouse, given the warehouse ID passed as URL query
 * @access Public
 */
router.post('/', (req, res) => {
  if (!req.query.id) res.json({ code: 400, status: 'Bad Request: Warehouse ID not passed' });

  /* Check input validation */
  const { errors, isValid } = validateWarehouseInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  console.log(req.body.inventory);

  // UPDATE `hoelweb`.`warehouse` SET `inventory` = '{\"ammo\":[]}' WHERE (`warehouse_id` = '4');
  const query = `UPDATE warehouse SET inventory='${req.body.inventory}' WHERE (warehouse_id=${req.query.id})`;

  sql(query).then((data) => {
    if (data.error) res.json(data);
    res.json(data.rows);
  });

  return null;
});

// /**
//  * @route GET api/v1/warehouse/all
//  * @desc Retrieves all warehouse. Option to pass limit (defaults to 50) and desc (defaults to true) as URL query strings
//  * @access Public
//  *
//  * @example localhost:5000/api/v1/warehouse/all?limit=100&desc=false
//  *
//  * @param {string} limit - Number of records to return
//  * @param {bool} desc - List will be returned sorted by DESC unless this is false
//  */
// router.get('/all', (req, res) => {
//   // Default value if limit is not passed
//   let limit = 'LIMIT 0, 50';
//   if (req.query.limit) limit = `LIMIT 0, ${req.query.limit}`;

//   let desc = '';
//   if (req.query.desc !== 'false') desc = `ORDER BY msn_id DESC`;

//   const query = `SELECT * from msn ${desc} ${limit}`;
//   sql(query).then((data) => {
//     if (data.error) res.json(data);
//     res.json(data.rows);
//   });
// });

// /**
//  * @route GET api/warehouse/mission
//  * @desc Retrieves a spessific mission based and briefing on the passed ID (as URL query)
//  * @access Public
//  *
//  * @example localhost:5000/api/warehouse/mission?id=115
//  *
//  * @param {string} id - ID of mission to return
//  */
// router.get('/mission', (req, res) => {
//   if (!req.query.id) res.json({ code: 400, status: 'Bad Request: Mission id not passed' });

//   const query = `SELECT a.*, b.* FROM msn a JOIN msn_briefing b ON b.msn_id = a.msn_id WHERE a.msn_id=${req.query.id}`;

//   sql(query).then((data) => {
//     if (data.error) res.json(data);
//     res.json(data.rows);
//   });
// });

module.exports = router;
