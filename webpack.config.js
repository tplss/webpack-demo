const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const glob = require('glob');

const parts = require('./webpack.parts');
function resolve(dir) {
  return path.join(__dirname, dir);
}
const PATHS = {
  app: resolve('app'),
  build: resolve('build'),
};

const commonConfig = merge([
  {
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('app'),
      },
    },
    resolveLoader: {
      alias: {
        'demo-loader': path.resolve(
          __dirname, 'loaders/demo-loader.js'
        ),
      },
    },
  },
  parts.lintJavaScript({ include: PATHS.app }),
  parts.loadVue({include: PATHS.app}),
  parts.lintCSS({ include: PATHS.app }),
  parts.loadFonts({
    options: {
      name: '[name].[hash:8].[ext]',
    },
  }),
  parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
  {
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 300000, // in bytes
      maxAssetSize: 450000, // in bytes
    },
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[chunkhash:8].js',
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
    ],
    recordsPath: path.join(__dirname, 'records.json'),
  },
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
        // Run cssnano in safe mode to avoid
        // potentially unsafe transformations.
        safe: true,
      },
    },
  }),
  parts.extractBundles([
    {
      name: 'vendor',
      minChunks: ({ resource }) => (
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
      ),
    },
    {
      name: 'manifest',
      minChunks: Infinity,
    },
  ]),
  parts.attachRevision(),
  parts.generateSourceMaps({ type: 'source-map' }),
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix()],
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[hash:8].[ext]',
    },
  }),
  parts.setFreeVariable(
    'process.env.NODE_ENV',
    'production'
  ),
]);

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    },
  },
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
]);

module.exports = (env) => {
  const pages = [
    parts.page({
      title: 'Webpack demo',
      template: resolve('./app/index.html'),
      entry: {
        app: path.join(PATHS.app, './main.js'),
      },
      chunks: ['app', 'manifest', 'vendor'],
    }),
  ];
  const config = env === 'production'
    ? productionConfig
    : developmentConfig;

  return merge([commonConfig, config].concat(pages));
};
