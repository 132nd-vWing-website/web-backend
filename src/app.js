const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const path = require('path');

// MongoDB Routes
// const profile = require('../routes/api/profile');
// const posts = require('../routes/api/posts');
// const notams = require('../routes/api/notams');

// MYSQL Routes
const events = require('../routes/api/events');
const usersSql = require('../routes/api/users-sql');
const missions = require('../routes/api/missions');
const airfields = require('../routes/api/airfields');
const warehouse = require('../routes/api/warehouse');
const ato = require('../routes/api/ato');

// Static Routes
// const docs = require('../routes/docs/docs');
// const statics = require('../routes/statics/statics');

// Initialize the server
const app = express();

// Body-Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('../config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    // Options
    useNewUrlParser: true,
  })
  .catch((err) => console.log('!!! %s', err));

// Passport middleware
app.use(passport.initialize());

// Passport Configs
require('../config/passport')(passport);

// MongoDB API End-points
// app.use('/api/v1/profile', profile);
// app.use('/api/v1/posts', posts);
// app.use('/api/v1/notams', notams);

// SQL API End-points
app.use('/api/v1/events', events);
app.use('/api/v1/users', usersSql);
app.use('/api/v1/missions', missions);
app.use('/api/v1/airfields', airfields);
app.use('/api/v1/warehouse', warehouse);
app.use('/api/v1/ato', ato);

// Use route for Documentation
// app.use('/docs/', docs);

// Use route for Static page-content
// app.use('/api/v1/statics/', statics);

// Serve API Documentation for any non-resolvable route - NOTE! Only works in production
app.use(express.static('./www'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './www', 'index.html'));
});

module.exports = app;
