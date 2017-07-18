import React from 'react';

// use strokeDasharray and strokeDashoffset for animations

function OMark({ height, width }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="blank-mark"
      aria-label=" "
      role="img"
      viewBox="0 0 32 32"
      style={{
        visibility: 'visible',
        height: height || '32px',
        width: width || '32px',
      }}
    >
    </svg>
  );
}

export default OMark;
