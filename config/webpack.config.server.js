const path = require('path');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = function (env) {
  const dev = !!(env && env.development);
  // babel-preset-react-app requires `NODE_ENV` or `BABEL_ENV`
  if (!(process.env.NODE_ENV || process.env.BABEL_ENV)) {
    process.env.NODE_ENV = dev ? 'development' : 'production';
  }
  // process.env.BUILD_TARGET = 'server'; // ???


  return {
    devtool: dev ? 'inline' : 'source-map',
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    watch: dev,

    entry: {
      // hotReloading: 'webpack/hot/poll?1000',
      server: './src/server'
    },

    output: {
      path: path.resolve(path.join(__dirname, '../build/server')),
      filename: 'index.js',
    },

    externals: [
      nodeExternals({
        whitelist: [
          'webpack/hot/poll?1000',
        ]
      })
    ],

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
        // 'process.env.BUILD_TARGET': JSON.stringify('server'),
      })
    ]
      .concat(
        dev ? [
          new StartServerPlugin('index.js'),
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
      ]
    },

    resolve: {
      extensions: [
        '.js',
        '.json',
      ]
    },
  };
};
