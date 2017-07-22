import { boardWonBy } from '../client/game/utils';

// FIXME: use redis for the data store (presistence between app deployments)
const searches = [];
// const games = [];

export default function networkGame(io) {
  io.on('connection', (socket) => {
    console.log('websocket connected');

    socket.on('disconnect', () => {
      console.log('disconnect', socket.data);
    });

    socket.data = Object.assign({}, socket.data, {
      name: generateName(),
      wins: 0,
      losses: 0,
      draws: 0,
      interrupts: 0,
    });
    socket.emit('named', socket.data.name);

    socket.on('startNetworkGameSearch', (prefs) => {
      console.log(`${socket.data.name} (${socket.id}) started a search for a network game`);
      // TODO: use prefs for matching
      const search = {
        socket,
        startedLooking: Date.now(),
      };
      socket.on('disconnect', () => {
        const searchIndex = searches.indexOf(search);
        if (searchIndex < 0) {
          // already removed
          return;
        }

        searches.splice(searchIndex, 1);
      });
      searches.push(search);
    });
  });

}

function pairNetworkGameSearches() {
  if (searches.length < 1) {
    return;
  }

  if (searches.length < 2) {
    // how long has their search been going?
    // probably abort their search, alert them when someone else starts a search?
    console.warn('only one active search for a network game');
    return;
  }

  console.info('pairNetworkGameSearches started', searches.length);

  // oldest to newest
  // TODO: too much time for large sets?
  searches.sort((a, b) => a.startedLooking - b.startedLooking);

  // to prevent blocking the event loop, only pair max n games at a time
  var pairAttempts = 0;
  // console.log('searches.length', searches.length);
  while ((searches.length > 1) && (pairAttempts++ < 1e2) ) {
    // console.log('searches.length', searches.length);
    const searchXIndex = 0;
    const searchOIndex = searchXIndex + 1 + Math.floor((searches.length / 10) * Math.random());
    console.log(`player indexes ${searchXIndex}, ${searchOIndex}`);
    // removes an element, pull the later one first soas to not
    // disrupt the index of the earlier
    // (pull 3 first, then 2 otherwise 3 becomes 2 and that gets confusing)
    const searchO = searches.splice(searchOIndex, 1)[0];
    const searchX = searches.splice(searchXIndex, 1)[0];
    if (!searchX) {
      console.error(`no search at index ${searchXIndex}`);
      searchO && searches.push(searchO);
    }
    if (!searchO) {
      console.error(`no search at index ${searchOIndex}`);
      searchX && searches.push(searchX);
    }
    if (!(searchX && searchO)) {
      continue;
      // return;
    }

    console.log(`players being paired: X ${searchX.socket.data.name}(${searchX.socket.id}), O ${searchO.socket.data.name}(${searchO.socket.id}), `);

    const game = {
      players: {
        'x': searchX.socket,
        'o': searchO.socket,
      },
      started: Date.now(),
      cells: [ [], [], [], [], [], [], [], [], [] ],
      turn: 'x',
    };
    // games.push(game);
    ['x', 'o'].forEach((player) => {
      const otherPlayer = player === 'x' ? 'o' : 'x';

      game.players[player].on('networkGame::claimCell', ({board, row, col}) => {
        if (player !== game.turn) {
          // nacho turn!
          return;
        }
        if (game.cells[board][row * 3 + col]) {
          // already claimed
          return;
        }
        game.cells[board][row * 3 + col] = player;
        game.turn = otherPlayer;
        ['x','o'].forEach(l => game.players[l].emit('networkGame::update', {
          cells: game.cells,
          turn: player === 'x' ? 'o' : 'x',
        }));

        const gameWinner = boardWonBy(game.cells);

        if (gameWinner) {
          switch(gameWinner) {
            case 'draw':
              game.players[player].data.draws += 1;
              break;
            case player:
              game.players[player].data.wins += 1;
              break;
            case otherPlayer:
              game.players[player].data.losses += 1;
              break;
          }

          // do we need to store the game?
          // remove if so, but otherwize unneeded
          // const gameIndex = games.indexOf(game);
        }

        game.players[otherPlayer].on('disconnect', () => {
          game.players[player].data.interrupts += 1;
          // FIXME: make this more tolerant of bad connections
          // TODO: ban otherPlayer after too many interrupts?

          // FIXME: remove all listeners for both players
          console.error('cleanup after opponent disconnect');
        });

        game.players[otherPlayer].on('networkGame::forfeit', () => {
          // TODO: ban otherPlayer after too many forfeits?

          // FIXME: remove all listeners for both players
          console.error('cleanup after opponent forfeit');
        });
      });

      game.players[player].emit('networkGame::paired', {
        player,
        opponentName: game.players[otherPlayer].data.name,
      });

      game.players[player].emit('networkGame::update', {
        cells: game.cells,
        turn: 'x',
      });

    });
  }
  // console.log('pairNetworkGameSearches finished');
}
const intervalHandle = setInterval(pairNetworkGameSearches, 3e3);
if (module.hot) {
  module.hot.addDisposeHandler((data) => {
    console.log('disposing of networkGame.js, clearing interval');
    clearInterval(intervalHandle);
  });
}

var lastName;
function generateName() {
  if (!lastName) {
    lastName = String.fromCharCode('a'.charCodeAt(0) - 1);
  }

  const nameParts = lastName
    .split('')
    .map(c => c.charCodeAt(0));

  var lastPart = nameParts.pop();
  lastPart += 1;
  if (lastPart > 'z'.charCodeAt(0)) {
    nameParts.push('a'.charCodeAt(0));
    lastPart = 'a'.charCodeAt(0);
  }
  nameParts.push(lastPart);

  lastName = nameParts
    .map(n => String.fromCharCode(n))
    .join('');

  return lastName;
}
