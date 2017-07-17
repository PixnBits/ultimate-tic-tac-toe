import React, { Component } from 'react';

import UserMark from './marks/UserMark';

import './GameGrid.css';

class GameGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cells: [
        'x', 'o', 'x',
        'x', 'o', null,
        'o', 'x', null
      ],
    };
  }
  render() {
    const { cells } = this.state;
    const { cellType } = this.props;

    const GameCellType = cellType || UserMark;

    return (
      <div className="game-grid">
        {[0, 1, 2].map((rowNumber) => (
          <div key={rowNumber} className={`game-grid_row game-grid_row-${rowNumber}`}>
            {[0, 1, 2].map((colNumber) => (
              <div key={colNumber} className="game-grid_cell">
                <GameCellType claimed={cells[rowNumber * 3 + colNumber]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default GameGrid;
