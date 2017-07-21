import React, { Component } from 'react';

import Game from './game/Game';

import './App.css';

const savedSoloGame = JSON.parse(localStorage.getItem('soloGame'));

function writeSoloGameData(data) {
  localStorage.setItem('soloGame', JSON.stringify(data));
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-header">
          ULTIMATE Tic-Tac-Toe
        </h1>
        <Game
          initialData={savedSoloGame}
          onNew={() => writeSoloGameData(null)}
          onFinish={(winner) => console.log(winner === 'draw' ? 'draw' : `${winner} won!`)}
          onCellClaimed={writeSoloGameData}
        />

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
