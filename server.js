// Get the server app
const app = require('./src/app');

// Server Setup
const PORT = require('./config/keys').apiPort;

const processEnv = process.env.NODE_ENV || 'DEVELOPMENT';

console.log(':: Server Environment: %s', processEnv);
// Start the server...
app.listen(PORT, () => console.log('--> Server started on port %s', PORT));
