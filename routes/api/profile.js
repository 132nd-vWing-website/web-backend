const express = require('express');
// const mongoose = require('mongoose');
const passport = require('passport');

// Load input validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Initialize the router
const router = express.Router();

// Load Profile Model
const Profile = require('../../models/Profile');

// Load User Profile
const User = require('../../models/User');

// ///////////////////////////////////////////////////////////////

// @route   GET api/profile/test
// @desc    Tests the profiles route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Work!' }));

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);

      return null;
    })
    .catch((err) => res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);

      return null;
    })
    .catch(() => res.status(404).json({ profile: 'There are no profiles' }));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this handle';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(() => res.status(404).json({ profile: 'There is no profile for this handle' }));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(() => res.status(404).json({ profile: 'there is no profile for this user' }));
});

// @route   POST api/profile
// @desc    Create or Edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Check input validation
  const { errors, isValid } = validateProfileInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.callsign) profileFields.callsign = req.body.callsign;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  // Skills - Split into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  // Social - is defined to be its own object in the schema, and we need to initialize that object before adding data to it
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitch) profileFields.social.twitch = req.body.twitch;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

  Profile.findOne({ user: req.user.id }).then((profile) => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).then(
        (_profile) => res.json(_profile),
      );
    } else {
      // Check if handle exists
      Profile.findOne({ handle: profileFields.handle })
        .then((_profile) => {
          if (_profile) {
            errors.handle = 'That handle allready exists';
            res.status(400).json(errors);
          }
          // Save new profile
          new Profile(profileFields).save().then((__profile) => res.json(__profile));
        })
        .catch((err) => res.status(404).json(err));
    }
  });

  return null;
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Check input validation
  const { errors, isValid } = validateExperienceInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id }).then((profile) => {
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };

    // Add to exp array as the latest one (.unshift()) and not at the end (as with .push())
    profile.experience.unshift(newExp);

    profile.save().then((_profile) => res.json(_profile));
  });

  return null;
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Check input validation
  const { errors, isValid } = validateEducationInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id }).then((profile) => {
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };

    // Add to exp array as the latest one (.unshift()) and not at the end (as with .push())
    profile.education.unshift(newEdu);

    profile.save().then((_profile) => res.json(_profile));
  });

  return null;
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then((_profile) => res.json(_profile));
      })
      .catch((err) => res.status(404).json(err));
  },
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then((_profile) => res.json(_profile));
      })
      .catch((err) => res.status(404).json(err));
  },
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Removes the Profile
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      // Remove the User
      User.findOneAndRemove({ _id: req.user.id }).then(() => res.json({ success: true }));
    })
    .catch((err) => res.status(404).json(err));
});

module.exports = router;

// Other routes that should exist on the Profile:
// - instead of experiences, it should have events participated in - what role an the users AAR
// - skills should probably be removed, or made into what skills can the user contribute with to the community
// - instead of education, it should contain what qualifications that user have within the squadrons
// - a function similar to experiences/education must be added to list membership in wing/squadrons
