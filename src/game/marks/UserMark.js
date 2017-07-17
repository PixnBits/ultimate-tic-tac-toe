import React, { Component } from 'react';

class GameCell extends Component {
  render() {
    // var filler = '\u00A0';
    var filler = '_';
    const { claimed } = this.props;

    if (claimed) {
      filler = claimed;
    }

    return (
      <span className="game-cell">
        {filler}
      </span>
    );

  }
}

export default GameCell;
