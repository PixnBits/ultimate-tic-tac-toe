import React, { Component } from 'react';

// use strokeDasharray and strokeDashoffset for animations

class XMark extends Component {
  constructor() {
    super();

    this.state = {
      animationStep: 0,
    };
    this._timeoutHandle = null;
  }

  componentDidMount() {
    this._timeoutHandle = setTimeout(() => {
      this._timeoutHandle = setTimeout(() => {
        this._timeoutHandle = null;
        this.setState({ animationStep: 2 });
      }, 150);
      this.setState({ animationStep: 1 });
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
        className={`x-mark${className ? ` ${className}` : ''}`}
        aria-label="X"
        role="img"
        viewBox="0 0 32 32"
        style={Object.assign({
          visibility: 'visible',
          height: height || '32px',
          width: width || '32px',
        }, style)}
      >
        <path
          d="M 4 4 L 28 28"
          stroke="rebeccapurple"
          strokeWidth="3"
          style={{
            strokeDasharray: 135,
            strokeDashoffset: this.state.animationStep >= 1 ? 0 : 135,
            transition: 'stroke-dashoffset 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        <path
          d="M4,28L28,4"
          stroke="rebeccapurple"
          strokeWidth="3"
          style={{
            strokeDasharray: 135,
            strokeDashoffset: this.state.animationStep >= 2 ? 0 : 135,
            transition: 'stroke-dashoffset 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </svg>
    );
  }
}

export default XMark;
