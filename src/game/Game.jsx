import React, { Component } from 'react';

import GameGrid from './GameGrid';

// import './Game.css';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // players: [],
      cells: [
        [], [], [], [], [], [], [], [], [],
        // ['x', 'o', 'x', 'o', 'x', 'o', 'x', null, null],
        // ['o', 'x', 'o', 'x', 'o', 'x', null, null, 'o'],
        // ['x', 'o', 'x', 'o', 'x', 'o', null, null, null],
        // ['x', null, null, 'x', null, null, 'x', null, null],
        // [null, 'o', null, null, 'o', null, null, 'o', null],
        // [null, null, 'x', null, null, 'x', null, null, 'x'],
        // [],
        // [null, null, null, null, null, null, 'o', 'o', 'o'],
        // [],
      ],
      turn: 'x',
    };

    this.claimCell = this._claimCell.bind(this);
  }

  render() {
    const { cells } = this.state;

    return (
      <div className="game">
        <GameGrid
          cells={cells}
          cellType={GameGrid}
          claimCell={this.claimCell}
        />
      </div>
    );
  }

  _claimCell(board, row, col) {
    const currentTurn = this.state.turn;
    if (this.state.cells[board][row * 3 + col]) {
      // already claimed
      return;
    }
    const newCells = copyCells(this.state.cells);
    newCells[board][row * 3 + col] = currentTurn;
    this.setState({
      cells: newCells,
      turn: currentTurn === 'x' ? 'o' : 'x',
    });
  }
}

export default Game;

function copyCells(cells) {
  return cells
    .concat()
    .map(board => board.concat());
}
