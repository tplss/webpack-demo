const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}

const commonConfig = {
  entry: `${PATHS.app}/main.js`,
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': PATHS.app
    }
  },
  output: {
    path: path.join(PATHS.build, './main.js'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: PATHS.app
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.join(PATHS.build, 'img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.join(PATHS.build, 'media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.join(PATHS.build, 'fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: require('html-webpack-template'),
      title: 'Kanban app',
      appMountId: 'app',
      inject: false
    })
  ]
}

const developmentConfig = {
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,

    // display only errors to reduce the amount of output
    stats: 'errors-only',

    // parse host and port from env so this is easy
    // to customize
    host: process.env.HOST,
    port: process.env.PORT
  },
  module: {
    rules: [
      // Define development specific CSS setup
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}

const productionConfig = {
  output: {
    path: PATHS.build,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    rules: [
      // Extract CSS during build
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        }),
        include: PATHS.app
      }
    ]
  },
  plugins: [
    // Output extracted CSS to a file
    new ExtractTextPlugin('styles.[contenthash].css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"production"`
    }),
    // new UglifyJSPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: isVendor
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
  ]
}

function isVendor ({ resource }) {
  return (
    resource && resource.indexOf('node_modules') >= 0 && resource.match(/\.js$/)
  )
}

module.exports = env => {
  process.env.BABEL_ENV = env

  if (env === 'development') {
    return merge(commonConfig, developmentConfig)
  }

  return merge(commonConfig, productionConfig)
}
