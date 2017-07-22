const path = require('path');

const express = require('express');
const app = express();
const morgan = require('morgan');

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common'));

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackClientConfig = require('../../config/webpack.config.client');
  const compiler = webpack(webpackClientConfig({ development: true }));

  app.use(require('webpack-hot-middleware')(compiler));
  app.use(require('webpack-dev-middleware')(compiler));
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
