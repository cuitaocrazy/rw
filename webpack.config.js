const path = require('path')

module.exports = {
  entry: {
    popup: './src/popup.js',
    wordnote: './src/wordnote.js',
  },
  output: {
    path: path.resolve('./extensions'),
    filename: '[name].js',
  },
  module: {
    rules: [{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }],
  },
}
