const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');

// Load input validation
const validateRegisterInput = require('../../validation/register');
// const validateLoginInput = require('../../validation/login');

// Initialize the router
const router = express.Router();

// MySQL Connection
const sql = require('../../utils/db');

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
  const { errors, isValid } = validateRegisterInput({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    password2: req.body.password2,
  });

  if (!isValid) {
    console.log(errors);
    return res.status(400).json(errors);
  }

  // Check if the email address has allready been used..

  // If not, create a new user model..
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar: '',
    roles: [],
  };

  // .. hash the password and then save the user to the db
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (_err, hash) => {
      if (_err) throw _err;
      newUser.password = hash;

      // save user to db

      // return some data
      return res.status(200).json(newUser);
    });
  });

  /** TODO: Probably rewrite sql() to provide a promise, taking a query as a parameter */

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
  sql(query).then((data) => {
    if (data.error) res.json(data);
    res.json(data.rows);
  });
});

module.exports = router;
