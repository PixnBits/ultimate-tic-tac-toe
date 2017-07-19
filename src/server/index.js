const path = require('path');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;


app.get('/', express.static(path.join(__dirname, '../../build')));

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(PORT, function(){
  console.log(`listening on ${PORT}`);
});
