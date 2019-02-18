const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const path = require('path');

// Routes
const users = require('../routes/api/users');
const profile = require('../routes/api/profile');
const posts = require('../routes/api/posts');
const notams = require('../routes/api/notams');

// MYSQL Routes
const events = require('../routes/api/events');
const usersSql = require('../routes/api/users-sql');
const missions = require('../routes/api/missions');
const airfields = require('../routes/api/airfields');

const docs = require('../routes/docs/docs');
const statics = require('../routes/statics/statics');

// Initialize the server
const app = express();

// Body-Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('../config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    {
      // Options
      useNewUrlParser: true,
    },
  )
  .catch((err) => console.log('!!! %s', err));

// Passport middleware
app.use(passport.initialize());

// Passport Configs
require('../config/passport')(passport);

// Use API Routes
app.use('/api/v1/users', users);
app.use('/api/v1/profile', profile);
app.use('/api/v1/posts', posts);
app.use('/api/v1/notams', notams);

// SQL ready
app.use('/api/v1/events', events);
app.use('/api/v1/users-sql', usersSql);
app.use('/api/v1/missions', missions);
app.use('/api/v1/airfields', airfields);

// Use route for Documentation
app.use('/docs/', docs);

// Use route for Static page-content
app.use('/api/v1/statics/', statics);

// If we are in PRODUCTION - then we want to server our client build folder for all non-api calls
// if (process.env.NODE_ENV === 'production') {
// Set static folder
app.use(express.static('build/public'));
app.get('*', (req, res) => {
  /*
   * IMPORTANT!! THIS WILL NEED TO POINT TO THE ACTUAL WEBCLIENT INDEX ON DEOPLYMENT! SEE https://tylermcginnis.com/react-router-cannot-get-url-refresh/
   */
  res.sendFile(path.resolve(__dirname, 'build', 'public', 'index.html'));
});
// }

module.exports = app;
