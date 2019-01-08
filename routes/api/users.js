const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Initialize the router
const router = express.Router();

// Get keys
const keys = require('../../config/keys');

// Load Model
const User = require('../../models/User');

// ///////////////////////////////////////////////////////////////

// @route   GET api/users/test
// @desc    Tests the users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works!' }));

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', (req, res) => {
  // Check input validation
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Check if the email address has allready been used..
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = 'E-mail already registered to a user';
      return res.status(400).json({
        errors,
      });
    }
    // If not, create a new user model..
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: '',
      roles: [],
    });

    // .. hash the password and then save the user to the db
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => res.json(user))
          .catch((err) => console.log(err));
      });
    });
  });
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  // Check input validation
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find the user by email...
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    // .. check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
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
    });
  });
});

// @route   GET api/users/current
// @desc    Return the current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    roles: req.user.roles,
  });
});

module.exports = router;
