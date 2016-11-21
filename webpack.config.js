const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcssImport = require("postcss-import");
const cssnext = require("postcss-cssnext");

const PATH = require('./path');
const path = require('path');
const fs = require('fs');
const entryFiles = fs.readdirSync(PATH.ENTRY_PATH);

const files = [];
const entries = {};

entryFiles
  .filter(file =>
    file.split('.')[0] && file.split('.').slice(-1)[0] === 'js'
  )
  .forEach(file => {
    const filename = file.split('.')[0];
    const filepath = path.join(PATH.ENTRY_PATH, file)
    entries[filename] = filepath;
});

module.exports = {
  entry: {
    index: './src/js/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: PATH.BUILD_PATH
  },
  module: {
    loaders: [
      {test: require.resolve("jquery"), loader: "expose?jQuery"},
      {test: require.resolve("jquery"), loader: "expose?$"},
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css!postcss")},
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: ["babel-loader"],
        query: {
          presets: ["es2015"]
        }
      }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  postcss: function() {
    return [
      postcssImport({addDependencyTo: webpack}),
      cssnext({autoprefixer: {browsers: "ie >= 9, ..."}})
    ];
  },
  plugins: [
    new ExtractTextPlugin("[name].bundle.css", {
      allChunks: true
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new CleanPlugin(PATH.BUILD_PATH, {
      root: PATH.ROOT_PATH,
      verbose: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['index']
    })
  ],
  debug: true,
  displayErrorDetails: true,
  outputPathinfo: true,
  devtool: "cheap-module-eval-source-map"
};
