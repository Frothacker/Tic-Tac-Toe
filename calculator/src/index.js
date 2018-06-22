import React, { Component }from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
      <button className={props.squareClass} onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends Component {
  renderSquare(i) {
    var squareClass = 'square'
    let line = this.props.winLine
    let x;
          // if a number in the winning line equals the current number
      if ((line !== null) && (line[0] === i || line[1] === i || line[2] === i)) {
        squareClass = 'winnerSquare'; // set class of square to be winner class. 
      }

    

    return ( 
      <Square 
        value={this.props.squares[i]}
        onClick={ () => {this.props.onClick(i)} }
        squareClass = {squareClass}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      winLine: [null]
    };
  }


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // makes copy of array for imutability (so not editing original state). 
    
    if (squares[i] || checkWinner(squares).winner) { // if there is winner or full square
      return; // then skip updating the square
    }

    squares[i] = this.state.xIsNext ? "X" : "0";
    this.setState({
      history: history.concat([{ 
        squares: squares, 
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winLine: checkWinner(squares).line
    }); // then sets state.
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0, 
      winLine: checkWinner(this.state.history[step].squares).line
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
      
    let winner = checkWinner(current.squares).winner;

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? "X" : "0");
    }

    const moves = history.map((step, move) => { // maps each item in the history array to a new "move". 
      const decision = move ? 
        'go to move #' + move : 
        'Go to game start';
      return (
        <li key = { move } > 
          <button onClick = { () => this.jumpTo(move) }>{decision}</button>
        </li>
      );

    });


    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = { current.squares }
            onClick = { (i) => this.handleClick(i) }
            winLine = {this.state.winLine}
          />

        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);



function checkWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //highlight the winning lines
      
      return { 
        "line": lines[i],
        "winner": squares[a]
      };
    }
  }
  return { 
        "line": null,
        "winner": null
      };

  Game.setWinline();
}

