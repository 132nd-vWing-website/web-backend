const express = require("express");
const passport = require("passport");
const mysql = require("mysql");

// Initialize the router
const router = express.Router();

// Roles middleware
const requireRole = require("../../validation/access/permissions");

// MySQL Connection
const sql = require("../../utils/db");

// Load input validation
// const validatePostInput = require("../../validation/posts");
/////////////////////////////////////////////////////////////////

/**
 * @route GET api/events/test
 * @desc Tests the events route
 * @access Public
 */
router.get("/test", (req, res) => res.json({ msg: "Events Work!" }));

/**
 * @route GET api/events/all
 * @desc Retrieves all events. Option to pass limit (defaults to 50) and desc (defaults to true) as URL query strings
 * @access Public
 *
 * @example localhost:5000/api/events/all?limit=100&desc=false
 *
 * @param {string} limit - Number of records to return
 * @param {bool} desc - List will be returned sorted by DESC unless this is false
 */
router.get("/all", (req, res) => {
  // Default value if limit is not passed
  let limit = "LIMIT 0, 50";
  if (req.query.limit) limit = `LIMIT 0, ${req.query.limit}`;

  let desc = "";
  if (req.query.desc !== "false") desc = `ORDER BY event_id DESC`;

  let query = `SELECT * from event ${desc} ${limit}`;
  sql(query, (err, rows) => {
    if (err) res.json(err);
    res.json(rows);
  });
});

/**
 * @route GET api/events/event
 * @desc Retrieves a spessific event based on the passed ID (as URL query)
 * @access Public
 *
 * @example localhost:5000/api/events/all?id=784
 *
 * @param {string} id - ID of event to return
 */
router.get("/event", (req, res) => {
  if (!req.query.id)
    res.json({ code: 400, status: "Bad Request: Event id not passed" });

  let query = `SELECT * from event WHERE event_id=${req.query.id}`;
  sql(query, (err, rows) => {
    if (err) res.json(err);
    res.json(rows);
  });
});

/**
 * @route GET api/events/event/signups
 * @desc Returns all pilots signed up to an event
 * @access Public
 *
 * @example /api/events/event/pilots?id=784&pilot=243
 *
 * @param {string} id - ID of event to return
 * @param {string} pilot - pilot User ID
 */
router.get("/event/pilots", (req, res) => {
  if (!req.query.id)
    res.json({ code: 400, status: "Bad Request: Event id not passed" });

  // If a pilot was passed (user_id), then we only want to get the record for that pilot
  let pilot = "";
  if (req.query.pilot) pilot = `AND b.user_id=${req.query.pilot}`;

  let query = `SELECT a.nickname, b.* FROM user a, event_signup b WHERE a.user_id = b.user_id AND b.event_id=${
    req.query.id
  } ${pilot}`;

  sql(query, (err, rows) => {
    if (err) res.json(err);
    res.json(rows);
  });
});

/**
 * @route GET api/events/pilots/flighthours
 * @desc Returns all pilots signed up to an event
 * @access Public
 *
 * @example localhost:5000/api/events/pilots/flighthours?pilot=236&desc=false
 *
 * @param {string} pilot - pilot User ID
 * @param {bool} desc - List will be returned sorted by DESC unless this is false
 */

router.get("/pilots/flighthours", (req, res) => {
  let pilot = "";
  if (req.query.pilot) pilot = `WHERE a.user_id=${req.query.pilot}`;

  let desc = "";
  if (req.query.desc !== "false") desc = `ORDER BY flight_hours DESC`;

  let query = `SELECT distinct a.user_id, a.nickname, (SELECT(SUM(b.aar_flighttime) / 60) FROM event_signup b WHERE b.user_id = a.user_id) AS flight_hours FROM user a ${pilot} ${desc}`;
  sql(query, (err, rows) => {
    res.json(rows);
  });
});

/////////////////////////////////////////////////////////////////

module.exports = router;
