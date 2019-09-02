const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Initialize the router
const router = express.Router();

// MySQL Connection
const sql = require('../../utils/db');

// Get keys
const keys = require('../../config/keys');

/**
 * @route GET api/v1/users/test
 * @desc Tests the events route
 * @access Public
 */
router.get('/test', (req, res) => res.json({ msg: 'Users SQL Work!' }));

/**
 * @route POST api/v1/users/register
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

  // TODO: Check if the email address has allready been used..

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

      console.log('Password Hash: %s', hash);

      // .. save user to db
      const query = `INSERT INTO users (name, password, email, avatar) VALUES ('${newUser.name}', '${newUser.password}', '${newUser.email}', '${newUser.avatar}')`;
      sql(query).then((data) => {
        if (data.error) res.status(400).json(data);
        res.status(200).json(data.rows);
        console.log(data);
      });
    });
  });

  return null;
});

/**
 * @route POST api/v1/users/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', (req, res) => {
  // Check input validation
  const { errors, isValid } = validateLoginInput({
    email: req.body.email,
    password: req.body.password,
  });

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  // Look up user by email
  const query = `SELECT * from users WHERE email='${email}'`;
  sql(query).then((data) => {
    const user = data.rows[0];

    // Throw error if user email is not found
    if (!user) {
      errors.email = 'User not found';
      return res.status(400).json(errors);
    }

    // .. check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // ... user matched! - Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          roles: user.roles,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600,
          },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`,
            });
          },
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }

      return null;
    });

    return null;
  });

  return null;
});

/**
 * @route GET api/v1/users/user
 * @desc Retrieves a spessific user
 * @access Private
 *
 * @example localhost:5000/api/v1/users/user?id=784
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
