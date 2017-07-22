import React, { Component } from 'react';

import Game from './game/Game';
import socket from './utils/socket';

import './App.css';

const savedSoloGame = global.localStorage ?
  JSON.parse(
    // renamed from soloGame to localGame
    global.localStorage.getItem('localGame') ||
    global.localStorage.getItem('soloGame')
  ) :
  null;

function writeSoloGameData(data) {
  if (!global.localStorage) {
    return false;
  }

  global.localStorage.setItem('localGame', JSON.stringify(data));
  return true;
}

class App extends Component {
  constructor(props) {
    super();

    this.findNetworkGame = this._findNetworkGame.bind(this);
    this.switchToLocalGame = this._switchToLocalGame.bind(this);
    this.forfeitNetworkGame = this._forfeitNetworkGame.bind(this);
    this.networkGamePaired = this._networkGamePaired.bind(this);
    this.networkGameUpdate = this._networkGameUpdate.bind(this);

    this.state = {
      gamePlayState: 'localGame',
    };

    socket.on('disconnect', () => {
      // FIXME: tolerance for flaky connections
      console.warn('disconnected from server');
      this.switchToLocalGame();
    });

    // emit networkGame::claimCell
    socket.on('networkGame::paired', this.networkGamePaired);
    socket.on('networkGame::update', this.networkGameUpdate);
  }

  _switchToLocalGame() {
    this.setState({
      gamePlayState: 'localGame',
    });
  }

  _findNetworkGame() {
    this.setState({
      gamePlayState: 'findingNetworkGame',
    });

    socket.emit('startNetworkGameSearch');
  }

  _forfeitNetworkGame() {
    this.switchToLocalGame();
    socket.emit('networkGame::forfeit');
  }

  _networkGamePaired({ player, opponentName }) {
    console.log('networkGamePaired', player, opponentName);
    this.setState({
      gamePlayState: 'networkGamePaired',
      player,
      opponentName,
    });
  }

  _networkGameUpdate({ cells, turn }) {
    console.log('networkGameUpdate', cells, turn);
    this.setState({
      gamePlayState: 'networkGame',
      cells,
      turn,
    });
  }

  renderLocalGame() {
    return [
      <p key="game-type">
        Local Game
        <button onClick={this.findNetworkGame}>
          Find a Network Game
        </button>
      </p>,
      <Game
        key="game"
        initialData={savedSoloGame}
        onNew={() => writeSoloGameData(null)}
        onFinish={(winner) => console.log(winner === 'draw' ? 'draw' : `${winner} won!`)}
        onCellClaimed={writeSoloGameData}
      />
    ];
  }

  renderNetworkGame() {
    const { cells, turn, player } = this.state;
    return [
      <p key="game-type">
        Network Game
        <button onClick={this.forfeitNetworkGame}>
          Forfeit
        </button>
      </p>,
      <Game
        key="game"
        player={player}
        cells={cells}
        turn={turn}
        onClaim={({ board, row, col }) => socket.emit('networkGame::claimCell', {board, row, col})}
        onFinish={(winner) => {
          console.log(winner === 'draw' ? 'draw' : `${winner} won network game!`);
          this.findNetworkGame();
        }}
      />
    ];
  }

  render() {
    const { gamePlayState } = this.state;
    return (
      <div className="App">
        <h1 className="App-header">
          ULTIMATE Tic-Tac-Toe
        </h1>
        { (gamePlayState === 'localGame') && this.renderLocalGame() }
        { (gamePlayState === 'networkGame') && this.renderNetworkGame() }
        { (gamePlayState === 'findingNetworkGame') && (
          <p>Searching for opponent...</p>
        )}
        <p style={{fontSize: 'small'}}>
          <a href="https://github.com/PixnBits/ultimate-tic-tac-toe/issues/new">
            Suggestions?
          </a>
        </p>
      </div>
    );
  }
}

export default App;
