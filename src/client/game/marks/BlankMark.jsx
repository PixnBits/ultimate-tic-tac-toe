import React from 'react';

// use strokeDasharray and strokeDashoffset for animations

function BlankMark({ height, width, className, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`blank-mark${className ? ` ${className}` : ''}`}
      aria-label=" "
      role="img"
      viewBox="0 0 32 32"
      style={Object.assign({
        visibility: 'visible',
        height: height || '32px',
        width: width || '32px',
      }, style)}
    >
    </svg>
  );
}

export default BlankMark;
