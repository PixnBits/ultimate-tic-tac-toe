import React, { Component } from 'react';

import GameGrid from './GameGrid';
import { boardWonBy } from './utils';

// import './Game.css';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(getNewGameState(), {
      // players: { x: null, o: null },
    });

    this.claimCell = this._claimCell.bind(this);
    this.newGame = this._newGame.bind(this);
  }

  render() {
    const { cells } = this.state;

    return (
      <div className="game">
        {
          this.state.turn ? (
            <h2>Turn: {this.state.turn.toUpperCase()}</h2>
          ) : (
            <h2>
              {
                this.state.result === 'draw' ? 'Draw' : 'Winner!'
              }
            </h2>
          )
        }
        <GameGrid
          cells={cells}
          cellType={GameGrid}
          claimCell={this.claimCell}
        />
        {
          this.state.turn ? (
            null
          ) : (
            <button onClick={this.newGame}>
              New Game
            </button>
          )
        }
      </div>
    );
  }

  _claimCell(board, row, col) {
    const currentTurn = this.state.turn;
    if (!currentTurn) {
      // can't claim cells after the game ended
      return;
    }

    if (this.state.cells[board][row * 3 + col]) {
      // already claimed
      return;
    }
    const newCells = copyCells(this.state.cells);
    newCells[board][row * 3 + col] = currentTurn;
    const gameWinner = boardWonBy(newCells);

    this.setState({
      cells: newCells,
      turn: gameWinner ? null : (currentTurn === 'x' ? 'o' : 'x'),
      result: gameWinner,
    });

    if (gameWinner) {
      if (this.props.onFinish) {
        this.props.onFinish.call(null, gameWinner);
      }
    }
  }

  _newGame() {
    this.setState(getNewGameState());
  }
}

export default Game;

function getNewGameState() {
  return {
    cells: [
      //*
      [], [], [], [], [], [], [], [], [],
      /*/
      ['x', 'o', 'x', 'o', 'x', 'o', 'x', null, null],
      ['o', 'x', 'o', 'x', 'o', 'x', null, null, 'o'],
      ['x', 'o', 'x', 'o', 'x', 'o', null, null, null],
      ['x', null, null, 'x', null, null, 'x', null, null],
      [null, 'o', null, null, 'o', null, null, 'o', null],
      [null, null, 'x', null, null, 'x', null, null, 'x'],
      [],
      [null, null, null, null, null, null, 'o', null, 'o'],
      [],
      //*/
    ],
    turn: 'x',
    result: undefined,
  }
}

function copyCells(cells) {
  return cells
    .concat()
    .map(board => board.concat());
}
