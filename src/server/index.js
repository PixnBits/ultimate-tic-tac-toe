import server from './server';

const PORT = process.env.PORT || 3000;
var currentServer = server;

function startServerListening() {
  if (process.env.NODE_ENV === 'development') {
    require('server-destroy')(server);
  }

  server.listen(PORT, function (err) {
    if (err) {
      console.error(`Error encountered when trying to listen on port ${PORT}: ${err.message}`);
      return;
    }
    console.log(`listening on ${PORT} 🌎`);
  });
}
startServerListening();

if (process.env.NODE_ENV === 'development' && module.hot) {
  // https://webpack.github.io/docs/hot-module-replacement.html#status-addstatushandler
  // https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
  // http://webpack.github.io/docs/hot-module-replacement-with-webpack.html#what-is-needed-to-use-it
  // https://github.com/webpack/webpack/issues/1220
  // https://hackernoon.com/hot-reload-all-the-things-ec0fed8ab0

  // apply updates
  module.hot.addStatusHandler((status) => {
    if (status !== 'ready') {
      return;
    }
    module.hot.apply();
  });

  // check for updates
  setInterval(() => {
    const status = module.hot.status();
    if (status === 'idle') {
      module.hot.check();
    }
  }, 1000);

  // modules we can hot reload
  module.hot.accept('./server', () => {
    console.log('hot reloading ./server, closing server...');
    currentServer.destroy(() => {
      console.log('closed server');
      startServerListening();
      currentServer = server;
    });
  });
}
