const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
};

module.exports = function() {
  return merge([
    {
      entry: {
        app: PATHS.app,
      },
      output: {
        path: PATHS.build,
        filename: '[name].js',
      },
      plugins: [
        new webpack.NamedModulesPlugin(),
      ],
    },
    parts.clean(PATHS.build),
    parts.loadJavaScript(PATHS.app),
    // enable/disable minification to trigger/hide bug
    parts.minifyJavaScript({ useSourceMap: true }),
    parts.generateSourceMaps('cheap-module-source-map'), // cheap-source-map works!
  ]);
};
