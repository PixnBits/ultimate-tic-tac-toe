import React from 'react';

import XMark from './XMark';
import OMark from './OMark';
import BlankMark from './BlankMark';

function UserMark({ claimed, size, className, style }) {
  const pxSize = size || '20px';
  if (claimed && claimed.toLowerCase() === 'x') {
    return <XMark width={pxSize} height={pxSize} className={className} style={style} />;
  }

  if (claimed && claimed.toLowerCase() === 'o') {
    return <OMark width={pxSize} height={pxSize} className={className} style={style} />;
  }

  return <BlankMark width={pxSize} height={pxSize} className={className} style={style} />;
}

export default UserMark;
