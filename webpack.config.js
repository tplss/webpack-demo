const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const webpack = require('webpack');
const merge = require('webpack-merge');
const glob = require('glob');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
};

const common = merge([
  {
    // Entry accepts a path or an object of entries.
    // We'll be using the latter form given it's
    // convenient with more complex configurations.
    //
    // Entries have to resolve to files! It relies on Node.js
    // convention by default so if a directory contains *index.js*,
    // it will resolve to that.
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: HtmlWebpackTemplate,
        title: 'Webpack demo',
        appMountId: 'app', // Generate #app where to mount
        mobile: true, // Scale page on mobile
        inject: false, // html-webpack-template requires this to work
      }),
    ],
  },
  parts.lintCSS(
    PATHS.app,
    {
      'color-hex-case': 'lower',
    }
  ),
  parts.loadJavaScript(PATHS.app),
]);

module.exports = function(env) {
  return merge([
    common,
    {
      plugins: [
        new webpack.NamedModulesPlugin(),
      ],
    },
    parts.clean(PATHS.build),
    // enable/disable minification to trigger/hide bug
    parts.minifyJavaScript({ useSourceMap: true }),
    parts.generateSourceMaps('cheap-module-source-map'),
  ]);
};
