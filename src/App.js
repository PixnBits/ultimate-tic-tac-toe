import React, { Component } from 'react';

import Game from './game/Game';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-header">
          ULTIMATE <wbr />Tic-Tac-Toe
        </h1>
        <Game />
      </div>
    );
  }
}

export default App;
