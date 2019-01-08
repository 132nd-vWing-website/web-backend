const express = require('express');

const SanityClient = require('@sanity/client');
const sanityImg = require('@sanity/image-url')(SanityClient);

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
router.get('/test', (req, res) => res.json({ msg: 'statics/test works!' }));

// @route   GET docs/frontpagesliders
// @desc    Returns all documents of type FrontpageSliders
// @access  Public
router.get('/frontpagesliders', (req, res) => {
  SanityClient.fetch(`*[_type == "frontpageslider"]`)
    .then((docs) => {
      // Create a real URL for the background picture
      docs.forEach((doc) => {
        doc.bg = sanityImg.image(doc.bg).url();
      });

      // Index the slides by their index value
      const indexed = docs.sort((a, b) => {
        if (a.index > b.index) return 1;
        if (a.index < b.index) return -1;
        return 0;
      });

      // Return the modified doc items
      res.json(indexed);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
