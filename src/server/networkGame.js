import boardWonBy from '../utils/boardWonBy';

const MAX_PAIRS_PER_ITERATION = 1e2;
// FIXME: use redis for the data store (presistence between app deployments)
const searches = [];

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
      forfeits: 0,
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
  while ((searches.length > 1) && (pairAttempts++ < MAX_PAIRS_PER_ITERATION) ) {
    // console.log('searches.length', searches.length);
    const searchXIndex = 0;
    const searchOIndex = searchXIndex + 1 + Math.floor((searches.length / 10) * Math.random());
    console.log(`search indexes ${searchXIndex}, ${searchOIndex}`);
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

    makeAPairOfNetworkGameSearches(searchX, searchO);
  }
  // console.log('pairNetworkGameSearches finished');
}

function makeAPairOfNetworkGameSearches(searchX, searchO) {
  const game = {
    id: `${Date.now().toString(16)}-${Math.floor(Math.random() * 1e9).toString(16)}`,
    players: {
      'x': searchX.socket,
      'o': searchO.socket,
    },
    started: Date.now(),
    cells: process.env.NODE_ENV === 'development' ?
      [ ['x','x','x'], ['x','x','x'], ['x','x'], [], [], [], ['o','o','o'], ['o','o','o'], ['o','o'], ] :
      [ [], [], [], [], [], [], [], [], [] ],
    turn: 'x',
  };

  console.log(`pairing players in game ${game.id}: X ${game.players.x.data.name}(${game.players.x.id}), O ${game.players.o.data.name}(${game.players.o.id})`);

  ['x', 'o'].forEach((playerTick) => {
    const otherPlayerTick = playerTick === 'x' ? 'o' : 'x';
    const player = game.players[playerTick];
    const otherPlayer = game.players[otherPlayerTick];

    const claimCellHandler = ({board, row, col}) => {
      if (playerTick !== game.turn) {
        // nacho turn!
        return;
      }
      if (game.cells[board][row * 3 + col]) {
        // already claimed
        return;
      }
      game.cells[board][row * 3 + col] = playerTick;
      game.turn = otherPlayerTick;
      ['x', 'o'].forEach(tick => game.players[tick].emit('networkGame::update', {
        cells: game.cells,
        turn: playerTick === 'x' ? 'o' : 'x',
      }));

      const wasAWinner = checkGameForWinnerAndUpdateStats(game);
      if (wasAWinner) {
        game.result = wasAWinner;
        endAndCleanup();
      }
    }

    const otherPlayerDisconnectHandler = () => {
      player.data.interrupts += 1;
      // FIXME: make this more tolerant of bad connections
      // TODO: ban other player after too many interrupts?

      otherPlayerForfeitHandler();
    };

    const otherPlayerForfeitHandler = () => {
      console.log(`player ${otherPlayerTick} forfeit (game ${game.id})`);
      // TODO: ban other player after too many forfeits?
      game.result = 'forfeit';
      otherPlayer.data.forfeits += 1;

      endAndCleanup();
    };


    player.on('networkGame::claimCell', claimCellHandler);
    otherPlayer.on('disconnect', otherPlayerDisconnectHandler);
    otherPlayer.on('networkGame::forfeit', otherPlayerForfeitHandler);

    function endAndCleanup() {
      // clean up
      otherPlayer.removeListener('disconnect', otherPlayerDisconnectHandler);

      player.removeAllListeners('networkGame::claimCell');
      otherPlayer.removeAllListeners('networkGame::claimCell');

      player.removeAllListeners('networkGame::forfeit');
      otherPlayer.removeAllListeners('networkGame::forfeit');

      // end
      game.turn = null;
      const updateData = {
        cells: game.cells,
        turn: game.turn,
        result: game.result,
      };
      player.emit('networkGame::update', updateData);
      otherPlayer.emit('networkGame::update', updateData);
    }

    // everything set up, send the pairing and data to the players
    player.emit('networkGame::paired', {
      player: playerTick,
      opponentName: otherPlayer.data.name,
    });

    player.emit('networkGame::update', {
      cells: game.cells,
      turn: game.turn,
    });

  });
}

function checkGameForWinnerAndUpdateStats(game) {
  const {
    cells,
    players: {
      x: playerX,
      o: playerO
    },
  } = game;

  const gameWinner = boardWonBy(cells);

  if (!gameWinner) {
    return;
  }

  game.finished = game.finished || Date.now();

  switch(gameWinner) {
    case 'draw':
      playerX.data.draws += 1;
      playerO.data.draws += 1;
      break;
    case 'x':
      playerX.data.wins += 1;
      playerO.data.losses += 1;
      break;
    case 'o':
      playerX.data.losses += 1;
      playerO.data.wins += 1;
      break;
  }

  return gameWinner;
}

const intervalHandle = setInterval(pairNetworkGameSearches, 3e3);
if (process.env.NODE_ENV === 'development' && module.hot) {
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
