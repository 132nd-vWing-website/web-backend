module.exports = {
  mongoURI: process.env.MONGO_URI,
  mySQL: {
    acquireTimeout: 300,
    connectionLimit: 100,
    connectTimeout: 2000,
    waitForConnection: true,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    debug: false
  },
  apiPort: process.env.PORT,
  secretOrKey: process.env.SECRET,
  sanityProjectID: process.env.SANITY_PROJECT_ID,
  sanityDataset: process.env.SANITY_DATASET,
  sanityToken: process.env.SANITY_TOKEN
};
