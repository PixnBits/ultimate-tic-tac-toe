import React, { Component } from 'react';

import GameGrid from './GameGrid';
import boardWonBy from '../../utils/boardWonBy';

// import './Game.css';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(
      getNewGameState(),
      props.initialData || {},
      this.buildStateFromProps(props),
    );

    this.claimCell = this._claimCell.bind(this);
    this.newGame = this._newGame.bind(this);
  }

  buildStateFromProps(props) {
    const state = {};
    [
      'cells',
      'turn',
      'result',
    ]
      .forEach(n => {
        if (n in props) {
          state[n] = props[n];
        }
      });
    return state;
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps nextProps', nextProps);
    this.setState(this.buildStateFromProps(nextProps));
  }

  render() {
    const { cells, turn, result } = this.state;
    const { player } = this.props;

    return (
      <div className="game">
        { player && (
          <p>{`Player: ${player.toUpperCase()}`}</p>
        )}
        <h2>
          {
            turn ? (
              `Turn: ${turn.toUpperCase()}`
            ) : (
              (result === 'draw' && 'Draw') ||
              (result === 'forfeit' && 'Win by forfeit') ||
              (result === player && 'Won!') ||
              (result !== player && 'Lost') ||
              result
            )
          }
        </h2>
        <GameGrid
          cells={cells}
          cellType={GameGrid}
          claimCell={this.claimCell}
        />
        { !player &&
          <button onClick={this.newGame}>
            New Game
          </button>
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

    if (this.props.onClaim) {
      this.props.onClaim.call(null, { board, row, col });
      return;
    }

    const newCells = copyCells(this.state.cells);
    newCells[board][row * 3 + col] = currentTurn;
    const gameWinner = boardWonBy(newCells);

    const newState = {
      cells: newCells,
      turn: gameWinner ? null : (currentTurn === 'x' ? 'o' : 'x'),
      result: gameWinner,
    };
    this.setState(newState);

    if (this.props.onCellClaimed) {
      this.props.onCellClaimed.call(null, newState);
    }

    if (gameWinner) {
      if (this.props.onFinish) {
        this.props.onFinish.call(null, gameWinner);
      }
    }
  }

  _newGame() {
    this.setState(getNewGameState());
    if (this.props.onNew) {
      this.props.onNew.call(null);
    }
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
