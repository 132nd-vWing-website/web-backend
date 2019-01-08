const express = require('express');
// const mongoose = require('mongoose');
const passport = require('passport');

// Initialize the router
const router = express.Router();

// Roles middleware
const requireRole = require('../../validation/access/permissions');

// Load Post Model
const Post = require('../../models/Post');

// Load Profile Model
const Profile = require('../../models/Profile');

// Load input validation
const validatePostInput = require('../../validation/posts');

// ///////////////////////////////////////////////////////////////
// Post.watch().on("change", change => console.log(new Date(), change));

// const returnAllNotams = () => {
//   Post.find({ type: 'notam' })
//     .sort({ date: -1 })
//     .then((posts) => res.json(posts))
//     .catch((err) => res.status(404).json({ error: 'An error occured' }));
// };

// ///////////////////////////////////////////////////////////////

/**
 * @route GET api/notams/test
 * @desc Tests the post route
 * @access Public
 */
router.get('/test', (req, res) => res.json({ msg: 'NOTAMS Work!' }));

// @route   GET api/notams
// @desc    Get all notams
// @access  Public
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.find({ type: 'notam' })
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch(() => res.status(404).json({ nopostfound: 'No posts found' }));
});

// @route   GET api/notams/unread
// @desc    Get all UNREAD notams
// @access  Public
router.get('/unread/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  // Get the list of unread posts from the user
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }

      // Return all posts in that array, where type is notam
      Post.find({ _id: { $in: profile.unread }, type: 'notam' })
        .sort({ date: 1 })
        .then((posts) => res.json(posts));

      return null;
    })
    .catch((err) => res.status(404).json(err));
});

// @route   DELETE api/notams/read/:id
// @desc    Removes a post from the user's unread list
// @access  Private
router.delete('/unread/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndUpdate({ user: req.user.id }, { $pull: { unread: req.params.id } })
    .then((profile) => {
      // Filter out the deleted notam's id from the array
      const _unread = profile.unread.filter((id) => id !== req.params.id);
      // Return all posts in the updated array, where type is notam
      Post.find({
        _id: { $in: _unread },
        type: 'notam',
      })
        .sort({ date: 1 })
        .then((posts) => res.json(posts));
    })
    .catch(() => res.status(404).json({ nopostfound: 'No post found' }));
});

// @route   DELETE api/notams/:id
// @desc    Delete a notam
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(() => {
    Post.findById(req.params.id)
      .then(() => {
        // Check for post owner
        // if (post.user.toString() !== req.user.id) {
        //   return res
        //     .status(401)
        //     .json({ notauthorized: "User not authorized" });
        // }

        // Delete
        Post.findOneAndRemove({
          _id: req.params.id,
          // }).then(() => res.json({ success: true }));
        }).then(() => {
          // Return back the new collection of NOTAMs
          Post.find({ type: 'notam' })
            .sort({ date: -1 })
            .then((posts) => res.json(posts))
            .catch(() => res.status(404).json({ error: 'An error occured' }));
        });
      })
      .catch(() => res.status(404).json({ nopostfound: 'No post found' }));
  });
});

// @route   PUT api/notams/:id
// @desc    Edit a notam
// @access  Private
router.put('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findByIdAndUpdate(req.body._id, {
    title: req.body.title,
    text: req.body.text,
    user: req.user.id,
  }).catch(() => res.status(404).json({ error: 'An error occured' }));
  // .then(post => {
  //   Post.find({ type: "notam" })
  //     .sort({ date: -1 })
  //     .then(posts => res.json(posts))
  //     .catch(err => res.status(404).json({ error: "An error occured" }));
  // });

  // Return back the new collection of NOTAMs
  Post.find({ type: 'notam' })
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch(() => res.status(404).json({ error: 'An error occured' }));

  return null;
});

// @route   POST api/notams/notams/
// @desc    Create post of type NOTAM
// @access  Private
router.post(
  // TODO: ADD WING-ROLE TO REQUIREMENTS SO THAT DIFFERENT WINGS CAN HAVE DIFFERENT NOTAMS (Will aslo require the post to have some sort of parent with the same tag)
  '/',
  passport.authenticate('jwt', { session: false }),
  requireRole('command'),
  // requireRole("132nd"),
  (req, res) => {
    // Check validation
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      type: 'notam',
      title: req.body.title,
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost
      .save()
      // Update all profiles with the new unread notam
      .then((post) => {
        const _id = post._id.toString();

        Profile.updateMany(
          { status: { $in: ['Guest', 'Active'] } },
          {
            $addToSet: {
              unread: _id,
            },
          },
        ).catch((err) => console.log(err));

        return post;
      })
      // TODO:Emit new message to all listening clients
      .then((post) => post)
      .then(() => {
        // Return back the new collection of NOTAMs
        Post.find({ type: 'notam' })
          .sort({ date: -1 })
          .then((posts) => res.json(posts))
          .catch(() => res.status(404).json({ error: 'An error occured' }));
      });

    return null;
  },
);

module.exports = router;
