import React from 'react';

// use strokeDasharray and strokeDashoffset for animations

function OMark({ height, width }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="o-mark"
      aria-label="O"
      role="img"
      viewBox="0 0 32 32"
      style={{
        visibility: 'visible',
        height: height || '32px',
        width: width || '32px',
      }}
    >
      <circle
        cx="16"
        cy="16"
        r="12"
        stroke="black"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}

export default OMark;
