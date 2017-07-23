import React from 'react';

import UserMark from './marks/UserMark';
import boardWonBy from '../../utils/boardWonBy';

import './GameGrid.css';

const noop = () => {};

function GameGrid({cells, cellType, claimCell, boardNumber}) {
  const GameCellType = cellType || UserMark;

  var smallBoardIsWon;
  var fullGameIsWon;

  if (!Array.isArray(cells[0])) {
    // a small board
    // look to see if a player owns this board
    smallBoardIsWon = boardWonBy(cells);
  } else {
    // the full board
    fullGameIsWon = boardWonBy(cells);
  }

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
      {
        smallBoardIsWon ? (
          <UserMark
            claimed={smallBoardIsWon}
            size="80px"
            className="board-won"
          />
        ) : (
          null
        )
      }
      {
        fullGameIsWon ? (
          <div style={{ position: 'absolute', top: '0px', left: '50%'}}>
            <UserMark
              claimed={fullGameIsWon}
              size="300px"
              className="board-won"
              style={{position: 'relative', left:'-50%'}}
            />
          </div>
        ) : (
          null
        )
      }
    </div>
  );
}

export default GameGrid;
