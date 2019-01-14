const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load input validation
const validateRegisterInput = require('../../validation/register');
// const validateLoginInput = require('../../validation/login');

// Initialize the router
const router = express.Router();

// MySQL Connection
const sql = require('../../utils/db');

// Get keys
const keys = require('../../config/keys');

/**
 * @route GET api/v1/users-sql/test
 * @desc Tests the events route
 * @access Public
 */
router.get('/test', (req, res) => res.json({ msg: 'Users SQL Work!' }));

/**
 * @route POST api/v1/users-sql/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', (req, res) => {
  /* Check input validation */
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  return null;
});

/**
 * @route GET api/v1/users-sql/user
 * @desc Retrieves a spessific user
 * @access Private
 *
 * @example localhost:5000/api/v1/users-sql/user?id=784
 *
 * @param {string} id - User ID
 */
router.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (!req.query.id) res.json({ code: 400, status: 'Bad Request: User ID not passed' });

  const query = `SELECT * from old_user WHERE user_id=${req.query.id}`;
  sql(query, (err, rows) => {
    if (err) res.json(err);
    res.json(rows);
  });
});

module.exports = router;
