// This service worker file is effectively a 'no-op' that will reset any
// previous service worker registered for the same host:port combination.
// See https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432

self.addEventListener('install', () => self.skipWaiting());
