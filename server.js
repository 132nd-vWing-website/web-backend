// Get the server app
const app = require('./src/app');

// Server Setup
const PORT = require('./config/keys').apiPort;

console.log(':: Server Environment: %s', process.env.NODE_ENV);
// Start the server...
app.listen(PORT, () => console.log('--> Server started on port %s', PORT));
