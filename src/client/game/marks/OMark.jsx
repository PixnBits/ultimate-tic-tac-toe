import React, { Component } from 'react';

// use strokeDasharray and strokeDashoffset for animations

class OMark extends Component {
  constructor() {
    super();

    this.state = {
      animationStep: 0,
    };
    this._timeoutHandle = null;
  }

  componentDidMount() {
    this._timeoutHandle =  setTimeout(() => {
      this.setState({ animationStep: 1 });
      this._timeoutHandle = null;
    });
  }

  componentWillUnmount() {
    if (this._timeoutHandle) {
      clearTimeout(this._timeoutHandle);
    }
  }

  render() {
    const { height, width, className, style } = this.props;
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
          stroke="#24a57b"
          strokeWidth="3"
          fill="none"
          style={{
            strokeDasharray: 325,
            strokeDashoffset: this.state.animationStep >= 1 ? 0 : 325,
            transition: 'stroke-dashoffset 0.7s cubic-bezier(0.51, 0.01, 0.46, 0.99)',
          }}
        />
      </svg>
    );
  }
}

export default OMark;
