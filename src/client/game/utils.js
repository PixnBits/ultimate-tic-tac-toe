export function boardWonBy(board) {
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

  // look for a draw
  if (board.filter(cell => !!cell).length === 9) {
    return 'draw';
  }

  return null;
}
