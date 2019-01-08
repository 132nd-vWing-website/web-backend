const express = require('express');
const SanityClient = require('@sanity/client');

// Get keys
const keys = require('../../config/keys');

SanityClient({
  projectId: keys.sanityProjectID,
  dataset: keys.sanityDataset,
  token: keys.sanityToken,
  useCdn: false,
});

// Initialize the router
const router = express.Router();

// @route   GET docs/test
// @desc    Tests the users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'docs/test works!' }));

// @route   GET docs/endpoints
// @desc    Returns all documents of type Endpoints
// @access  Public
router.get('/endpoints', (req, res) => {
  SanityClient.fetch(`*[_type == "endpoint"]`)
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
