const path = require('path');

/** Uncomment these if you want to use the commit number as a versioning string (build number for example) */
// const childProcess = require('child_process');
// const versionString = childProcess.execSync('git rev-list HEAD --count').toString();
// console.log('WEBPACK: ', versionString);

const config = {
  target: 'node',
  entry: {
    app: './server.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.build.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/env'],
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // use: ['babel-loader', 'eslint-loader'],
        use: ['babel-loader'],
      },
    ],
  },
};

if (process.env.NODE_ENV === 'production') {
  delete config.devtool;
}

module.exports = config;

// module.exports = {
//   target: 'node',
//   entry: {
//     app: './server.js',
//   },
//   output: {
//     path: path.resolve(__dirname, 'build'),
//     filename: 'server.build.js',
//   },
//   devtool: 'inline-source-map',
//   devServer: {
//     contentBase: './dist',
//   },
//   resolve: {
//     extensions: ['.js', '.jsx'],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         loader: 'babel-loader',
//         query: {
//           presets: ['@babel/env'],
//         },
//       },
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         // use: ['babel-loader', 'eslint-loader'],
//         use: ['babel-loader'],
//       },
//     ],
//   },
// };
