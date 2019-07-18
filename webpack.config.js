const path = require('path');

/** Uncomment these if you want to use the commit number as a versioning string (build number for example) */
// const childProcess = require('child_process');
// const versionString = childProcess.execSync('git rev-list HEAD --count').toString();
// console.log('WEBPACK: ', versionString);

let _DEVTOOL;
if (process.env.NODE_ENV === 'development') {
  _DEVTOOL = 'inline-source-map';
}

module.exports = {
  target: 'node',
  entry: './server.js',
  output: {
    filename: 'server.build.js',
    path: path.resolve(__dirname, 'build'),
  },
  devtool: _DEVTOOL,
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: false
        },
      })
    ],
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
