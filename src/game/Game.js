import React, { Component } from 'react';

import GameGrid from './GameGrid';

// import './Game.css';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
    };
  }
  render() {
    return (
      <div className="game">
        <GameGrid cellType={GameGrid}/>
      </div>
    );
  }
}

export default Game;
