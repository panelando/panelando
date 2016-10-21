const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: path.join(__dirname, './app'),
  entry: {
    js: './index.js',
    html: './index.html',
    vendors: [
      'react',
      'react-dom'
    ]
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
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
  ]
}
