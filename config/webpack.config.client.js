// if (process.env.NODE_ENV === 'development') {
//   module.exports = require('./webpack.config.client.dev.js');
// } else {
//   process.env.NODE_ENV = 'production';
//   module.exports = require('./webpack.config.client.prod.js');
// }

const path = require('path');

const pkg = require('../package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (env) {
  const dev = !!(env && env.development);
  // babel-preset-react-app requires `NODE_ENV` or `BABEL_ENV`
  if (!(process.env.NODE_ENV || process.env.BABEL_ENV)) {
    process.env.NODE_ENV = dev ? 'development' : 'production';
  }
  // process.env.BUILD_TARGET = 'web'; // ???

  return {
    devtool: dev ? 'inline' : 'source-map',
    watch: dev,

    entry: Object.assign(
      { 'service-worker': './src/client/service-worker' },
      dev ? {
        app: ['./src/client/index', 'webpack-hot-middleware/client'],
      } : {
        app: './src/client/index',
      }
    ),

    output: {
      path: path.resolve(path.join(__dirname, '../build/public')),
      filename: '[name].js',
      publicPath: '/'
    },

    externals: {
      'io': 'io',
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
          // 'BUILD_TARGET': JSON.stringify('web'),
          'PUBLIC_URL': JSON.stringify(''),
        }
      }),
      // index.html
      new HtmlWebpackPlugin({
        title: pkg.description,
        template: 'src/client/index.html',
        minify: {
          removeComments: true,
        },
        files: {
          js: [
            '/socket.io/socket.io.js',
          ]
        },
      }),
      // favicon.ico, etc
      new CopyWebpackPlugin([{ from: 'src/client/public' }]),
    ]
      .concat(
        dev ? [
          new webpack.NamedModulesPlugin(),
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
        ] : [
          new webpack.optimize.UglifyJsPlugin({
            minimize: !dev,
            compress: {
              warnings: false
            }
          }),
        ]
      ),

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /(\.css)$/,
          loaders: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss?$/,
          loader: 'style!css!sass',
          include: path.join(__dirname, 'src', 'styles'),
        },
        {
          test: /\.png$/,
          loader: 'file-loader',
        },
        {
          test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          loader: 'file-loader',
        }
      ]
    },
    resolve: {
      extensions: [
        '.js',
        '.json',
        '.jsx',
      ]
    },
  };
};
