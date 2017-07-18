import React from 'react';

import UserMark from './marks/UserMark';

import './GameGrid.css';

const noop = () => {};

function GameGrid({cells, cellType, claimCell, boardNumber}) {
  const GameCellType = cellType || UserMark;

  return (
    <div className="game-grid">
      {[0, 1, 2].map((rowNumber) => (
        <div key={rowNumber} className={`game-grid_row game-grid_row-${rowNumber}`}>
          {[0, 1, 2].map((colNumber) => {
            const index = rowNumber * 3 + colNumber;
            const onClick = () => claimCell(boardNumber, rowNumber, colNumber, 'x');
            return (
              <div
                key={colNumber}
                className={`game-grid_cell game-grid_cell-${rowNumber}-${colNumber}`}
                onClick={GameCellType === UserMark ? onClick : noop}

              >
                <GameCellType
                  boardNumber={index}
                  cells={cells[index]}
                  claimed={cells[index]}
                  claimCell={claimCell}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default GameGrid;
