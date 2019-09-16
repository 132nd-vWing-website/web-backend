const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Image functions
const Resize = require('../../utils/resize');

// Root directiry for uploaded files
const filePath = `static/images`;

// Multer Setup

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
  limits: {
    fileSize: 1024 * 1024 * 24, // Should give a file-limit of 25mb
  },
  fileFilter,
});

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
  async (req, res) => {
    console.log('Body: ', req.body);
    console.log('File: ', req.file);

    if (req.file === undefined || req.file === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Create and save resized versions of the Image
    const fileUpload = new Resize(filePath);
    const { filename, filepath } = await fileUpload.save(req.file.buffer);

    // TODO: there should be a database registry storing file name, path and author in the SQL database also!

    // Return some information to the client
    return res.status(200).json({ fileName: filename, filePath: filepath });
  },
);

module.exports = router;
