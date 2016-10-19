const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: path.join(__dirname, './app'),
  entry: {
    jsx: './index.js',
    html: './index.html'
  },
  output: {
    path: path.join(__dirname, './build'),
    filename: 'bundle.js'
  },
  module: {
    preloaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: [
        'eslint-loader'
      ]
    }],

    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: [
        'babel-loader'
      ]
    }, {
      test: /\.html$/,
      loaders: [
        'file?name=[name].[ext]'
      ]
    }]
  }
}
