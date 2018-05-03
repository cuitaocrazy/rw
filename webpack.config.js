const path = require('path')

module.exports = {
  entry: {
    popup: './src/popup.js',
    wordnote: './src/wordnote.js',
    ['content-script']: './src/content-script.js',
  },
  output: {
    path: path.resolve('./extensions'),
    filename: '[name].js',
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', { loader: 'css-loader', options: { modules: true } }] },
    ],
  },
}
