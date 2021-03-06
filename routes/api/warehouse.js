const express = require('express');

// Load input validation
const validateWarehouseInput = require('../../validation/warehouse');

// Initialize the router
const router = express.Router();

// MySQL Connection
const sql = require('../../utils/db');

/** ****************************************************************************** */

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
 * @route GET api/warehouse/:id
 * @desc Retrieves a spessific warehouse inventory, given the warehouse ID passed as parameter
 * @access Public
 *
 * @example localhost:5000/api/warehouse/1
 *
 * @param {string} id - ID of warehouse to return
 * @param {string} id - ID of event to return (choose either warehouse or event ID)
 *
 */
router.get('/:id', (req, res) => {
  const query = `SELECT inventory FROM warehouse WHERE warehouse_id=${req.params.id}`;

  sql(query).then((data) => {
    // console.log(data);
    if (data.error) res.json(data);
    // Should probably add some checking here, to see that we actually get some data returned
    res.json(JSON.parse(data.rows[0].inventory));
    // res.json(data.rows);
  });
});

/**
 * @route POST api/v1/warehouse/:id
 * @desc POSTS a new inventory JSON object to a specific warehouse, given the warehouse ID as parameter
 * @access Public
 */
router.post('/:id', (req, res) => {
  /* Check input validation */
  const { errors, isValid } = validateWarehouseInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const query = `UPDATE warehouse SET inventory='${req.body.inventory}' WHERE (warehouse_id=${req.params.id})`;

  sql(query).then((data) => {
    if (data.error) res.json(data);
    res.json(data.rows);
  });

  return null;
});

/**
 * @route GET api/warehouse/:id/:item
 * @desc Retrieves a spessific item from a warehouse, given the warehouse ID and item name as parameter
 * @access Public
 *
 * @example localhost:5000/api/warehouse/1/jp5
 *
 * @param {string} id - ID of warehouse to return
 * @param {string} item - Name of warehouse item to return
 *
 */
router.get('/:id/:item', (req, res) => {
  const item = req.params.item.toUpperCase();

  const query = `SELECT inventory -> '$.${item}' as ${item} FROM warehouse WHERE warehouse_id=${req.params.id}`;

  sql(query).then((data) => {
    if (data.error) res.json(data);
    res.json(data.rows);
  });
  console.log(req.params);
});

module.exports = router;
