const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')

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
  resolve: {
    modulesDirectories: ['app', 'node_modules'],
    extensions: ['', '.scss', '.css', '.js', '.jsx', '.json']
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
      test: /\.(html|json|png)$/,
      loaders: [
        'file?name=[name].[ext]'
      ]
    }, {
      test: /\.(scss|css)$/,
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass')
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new ExtractTextPlugin('bundle.css', { allChunks: true }),
    new CopyPlugin([
      { from: 'images/icons/*' },
      { from: 'manifest.json' }
    ]),
    new SWPrecachePlugin({
      cacheId: 'panelando-v1',
      filename: 'sw.js',
      runtimeCaching: [{
        urlPattern: /^https:\/\/firebasestorage\.googleapis\.com/,
        handler: 'cacheFirst'
      }]
    })
  ]
}
