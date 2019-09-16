const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Root directiry for uploaded files
const filePath = `./static/images/`;

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, filePath);
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

// Load input validation
// const validateRegisterInput = require('../../validation/register');
// const validateLoginInput = require('../../validation/login');

// Initialize the router
const router = express.Router();

// MySQL Connection
const sql = require('../../utils/db');

// Get keys
const keys = require('../../config/keys');

/**
 * @route GET api/v1/upload/image/test
 * @desc Tests the upload/image route
 * @access Public
 */
router.get('/test', (req, res) => res.json({ msg: 'Success!' }));

router.route('/upload').post(
  // passport.authenticate('jwt', { session: false }),
  upload.single('imageData'),
  (req, res) => {
    console.log('Body: ', req.body);
    console.log('File: ', req.file);

    if (req.file === undefined || req.file === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // TODO: there should be a database registry storing file name, path and author in the SQL database also!

    const { filename, path } = req.file;
    return res.status(200).json({ fileName: filename, filePath: path });
  },
);

// router.post('/upload', (req, res) => {
//   // router.post('/upload', passport.authenticate('jwt', { session: false }), (req, res) => {
//   if (req.files === undefined || req.files === null) {
//     return res.status(400).json({ msg: 'No file uploaded' });
//   }

//   const { file } = req.files;

//   file.mv(`${__dirname}/files/uploads/images/${file.name}`, (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send(err);
//     }

//     res.json({ fileName: file.name, filePath: `/images/${file.name}` });

//     // TODO: there should be a database registry storing file name, path and author in the SQL database also!

//     return null;
//   });

//   return null;
// });

/**
 * @route GET api/v1/users/current
 * @desc Return the current user
 * @access Private
 */
// router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
//   res.json({
//     id: req.user.id,
//     callsign: req.user.callsign,
//     email: req.user.email,
//     avatar: req.user.avatar,
//     roles: req.user.roles,
//   });
// });

module.exports = router;
