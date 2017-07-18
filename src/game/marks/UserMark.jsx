import React from 'react';

import XMark from './XMark';
import OMark from './OMark';
import BlankMark from './BlankMark';

function GameCell({ claimed }) {
  if (claimed && claimed.toLowerCase() === 'x') {
    return <XMark width="20px" height="20px"/>;
  }

  if (claimed && claimed.toLowerCase() === 'o') {
    return <OMark width="20px" height="20px"/>;
  }

  return <BlankMark width="20px" height="20px"/>;
}

export default GameCell;
