const express = require('express');
// const mongoose = require('mongoose');
const passport = require('passport');

// Initialize the router
const router = express.Router();

// Load Post Model
const Post = require('../../models/Post');

// Load Profile Model
const Profile = require('../../models/Profile');

// Load input validation
const validatePostInput = require('../../validation/posts');

// ///////////////////////////////////////////////////////////////

/* SEE http://apidocjs.com/ for parameters! */

/**
 * @apiversion 0.1.0
 * @api {get} /api/v1/posts/test Test endpoint
 * @apiName test-posts-public
 * @apiGroup Posts (Public)
 *
 * @apiSuccess {string} metadata.msg as a string with an OK message
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Posts Works!"
 *     }
 */
router.get('/test', (req, res) => res.json({ msg: 'Posts Works!' }));

/**
 * @apiversion 0.1.0
 * @api {get} /api/v1/posts/ Get all posts
 * @apiName get-posts-public
 * @apiGroup Posts (Public)
 *
 * @apiSuccess {array} metadata as array of objects, containing all posts
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       [
 *        {
 *          "_id": "5b6f57c1cd0b100012cb4f71",
 *          "type": "notam",
 *          "title": "A notam #1",
 *          "text": "Text here..",
 *          "user": "5b462250c01a7e0d3c0f6323",
 *          "likes": [],
 *          "comments": [],
 *          "date": "2018-08-11T21:40:17.248Z",
 *          "__v": 0
 *        },
 *        {
 *          "_id": "5b576d936dba280014b1d5a4",
 *          "type": "notam",
 *          "title": "Another Notam!",
 *          "text": "Important text here...",
 *          "user": "5b576c046dba280014b1d5a2",
 *          "likes": [],
 *          "comments": [],
 *          "date": "2018-07-24T18:18:59.339Z",
 *          "__v": 0
 *        }
 *       ]
 *     }
 */
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch(() => res.status(404).json({ nopostfound: 'No posts found' }));
});

/**
 * @apiversion 0.1.0
 * @api {get} /api/v1/posts/:id Get posts by ID
 * @apiName get-posts-by-id-public
 * @apiGroup Posts (Public)
 *
 * @apiParam {string} id ID of post to retrieve
 *
 */
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((posts) => res.json(posts))
    .catch(() => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private

/**
 * @name Posts: POST a new post
 * @path {POST} api/v1/posts/
 * @header {string} Authentication as 'Bearer token'
 * @header {string} Content-Type as application/x-www-form-urlencoded
 */

/**
 * @apiversion 0.1.0
 * @api {post} /api/v1/posts/ Post a new posts
 * @apiName post-post
 * @apiGroup Posts (Private)
 * @apiPrivate
 *
 * @apiHeader {String} Authentication as Bearer token
 * @apiHeader {string} Content-Type as application/x-www-form-urlencoded*
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authentication": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *       "Content-Type": "application/x-www-form-urlencoded"
 *     }
 *
 *
 *
 * @apiSuccess {array} metadata.post Object the posts
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        {
 *          "_id": "5b6f57c1cd0b100012cb4f71",
 *          "type": "notam",
 *          "title": "A notam #1",
 *          "text": "Text here..",
 *          "user": "5b462250c01a7e0d3c0f6323",
 *          "likes": [],
 *          "comments": [],
 *          "date": "2018-08-11T21:40:17.248Z",
 *          "__v": 0
 *        }
 *     }
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Check validation
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    type: 'public',
    title: req.body.title,
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  });

  newPost.save().then((post) => res.json(post));

  return null;
});

/**
 * @apiversion 0.1.0
 * @api {delete} /api/v1/posts/:id Delete a post by ID
 * @apiName get-posts-by-id-public
 * @apiGroup Posts (Private)
 * @apiPrivate
 *
 * @apiParam {string} id ID of post to retrieve
 *
 * @apiHeader {String} Authentication as Bearer token
 *
 * @apiSuccess {array} metadata.post as a post (object)
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        {
 *          "_id": "5b6f57c1cd0b100012cb4f71",
 *          "type": "notam",
 *          "title": "A notam #1",
 *          "text": "Text here..",
 *          "user": "5b462250c01a7e0d3c0f6323",
 *          "likes": [],
 *          "comments": [],
 *          "date": "2018-08-11T21:40:17.248Z",
 *          "__v": 0
 *        }
 *     }
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(() => {
    Post.findById(req.params.id)
      .then((post) => {
        // Check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: 'User not authorized' });
        }

        // Delete
        Post.findOneAndRemove({
          _id: req.params.id,
        }).then(() => res.json({ success: true }));

        return null;
      })
      .catch(() => res.status(404).json({ nopostfound: 'No post found' }));
  });
});

// @route   POST api/posts/like/:id
// @desc    Like a post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(() => {
    Post.findById(req.params.id)
      .then((post) => {
        // Check if user has liked post already
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
          return res.status(400).json({ alreadyliked: 'User allready liked this post' });
        }

        // Add the user id to likes array
        post.likes.unshift({ user: req.user.id });

        post.save().then((_post) => res.json(_post));

        return null;
      })
      .catch(() => res.status(404).json({ nopostfound: 'No post found' }));
  });
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(() => {
    Post.findById(req.params.id)
      .then((post) => {
        // Check if user has liked post already
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
          return res.status(400).json({ notliked: 'User as not yet liked this post' });
        }

        // Get remove index
        const removeIndex = post.likes.map((item) => item.user.toString()).indexOf(req.user.id);

        // Splice out of array
        post.likes.splice(removeIndex, 1);

        // Save
        post.save().then((_post) => res.json(_post));

        return null;
      })
      .catch(() => res.status(404).json({ nopostfound: 'No post found' }));
  });
});

// @route   POST api/posts/comment/:id
// @desc    Comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Check validation
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then((post) => {
      // New comment object
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
      };

      // Add to posts comment array as latest
      post.comments.unshift(newComment);

      // Save
      post.save().then((_post) => res.json(_post));
    })
    .catch(() => res.status(404).json({ postnotfound: 'No post found' }));

  return null;
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        // Check to see if comment exists
        if (
          post.comments.filter((comment) => comment._id.toString() === req.params.comment_id)
            .length === 0
        ) {
          return res.status(404).json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        // Save
        post.save().then((_post) => res.json(_post));

        return null;
      })
      .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
  },
);

module.exports = router;
