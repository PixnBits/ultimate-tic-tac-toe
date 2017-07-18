import React from 'react';

import UserMark from './marks/UserMark';

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

function boardWonBy(board) {
  if (Array.isArray(board[0])) {
    // board of boards
    // look through each board to find all winnings
    return boardWonBy(board.map(boardWonBy));
  }

  // 0 1 2
  // 3 4 5
  // 6 7 8
  const b = board.map(c => (c && c.toLowerCase()) || c);

  for (let i=0; i < 9; i += 3) {
    if (b[i] && b[i] === b[i + 3] && b[i + 3] === b[i + 3 + 3]) {
      return b[i];
    }
  }
  // look for verticals
  for (let i=0; i < 3; i += 1) {
    if (b[i] && b[i] === b[i + 3] && b[i + 3] === b[i + 3 + 3]) {
      return b[i];
    }
  }

  // look for horizontals
  for (let i=0; i < 9; i += 3) {
    if (b[i] && b[i] === b[i + 1] && b[i + 1] === b[i + 1 + 1]) {
      return b[i];
    }
  }

  // look for diagonals
  if (b[0] && b[0] === b[4] && b[4] === b[8]) {
    return b[0];
  }
  if (b[2] && b[2] === b[4] && b[4] === b[6]) {
    return b[2];
  }

  return null;
}
