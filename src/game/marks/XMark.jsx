import React from 'react';

// use strokeDasharray and strokeDashoffset for animations

function XMark({ height, width }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="x-mark"
      aria-label="X"
      role="img"
      viewBox="0 0 32 32"
      style={{
        visibility: 'visible',
        height: height || '32px',
        width: width || '32px',
      }}
    >
      <path
        d="M 4 4 L 28 28"
        stroke="black"
        strokeWidth="3"
      />
      <path
        d="M4,28L28,4"
        stroke="black"
        strokeWidth="3"
      />
    </svg>
  );
}

export default XMark;
