const socket = io();

socket.on('named', (name) => {
  console.log(`we've been named! "${name}"`);
});

export default socket;
