import React from 'react';

// use strokeDasharray and strokeDashoffset for animations

function OMark({ height, width, className, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`o-mark${className ? ` ${className}` : ''}`}
      aria-label="O"
      role="img"
      viewBox="0 0 32 32"
      style={Object.assign({
        visibility: 'visible',
        height: height || '32px',
        width: width || '32px',
      }, style)}
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
