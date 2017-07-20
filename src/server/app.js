const path = require('path');

const express = require('express');
const app = express();
const morgan = require('morgan');

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common'));

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackClientConfig = require('../../config/webpack.config.client');
  app.use(webpackMiddleware(webpack(webpackClientConfig({ development: true }))));
} else {
  app.get('*', express.static(path.resolve(path.join(__dirname, '../../build/public'))));
}

io.on('connection', function(socket){
  console.log('a user connected');
});

export default http;
export {
  app,
  // io,
};
