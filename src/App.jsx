import React, { Component } from 'react';

import Game from './game/Game';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-header">
          ULTIMATE Tic-Tac-Toe
        </h1>
        <Game onFinish={(winner) => console.log(winner === 'draw' ? 'draw' : `${winner} won!`)}/>
      </div>
    );
  }
}

export default App;
