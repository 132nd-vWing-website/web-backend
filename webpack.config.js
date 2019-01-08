const path = require('path');

/** Uncomment these if you want to use the commit number as a versioning string (build number for example) */
// const childProcess = require('child_process');
// const versionString = childProcess.execSync('git rev-list HEAD --count').toString();
// console.log('WEBPACK: ', versionString);

module.exports = {
  entry: {
    app: './server.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].build.js',
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
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
};
