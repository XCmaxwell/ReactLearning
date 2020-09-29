import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Square(props) {
  return(
    <button className = "square"
    style = {props.hightLight?{"color":"red"}:{}}
    onClick = {props.onClick}
    >
    {props.value}
    </button>
  );
}


class Board extends React.Component {

  renderSquare(i) {
    return (<Square key={i} 
      hightLight = {this.props.winner && this.props.winner.includes(i)}
      value = {this.props.squares[i]}
      onClick = {()=> this.props.onClick(i)}
    />);
  }

  renderBoardRow (j) {
    let element = []
    for (let i = 0; i < this.props.row; i++) {
      element.push(this.renderSquare(j + i))
    }
    return (<div className='board-row' key ={j}>{element}</div>)
  }

  render() {
    let element = []
    for (let i = 0; i < this.props.row; i++) {
      element.push(this.renderBoardRow(i*this.props.row))
    }
    return (<div>{element}</div>)
  }
}

class Game extends React.Component {
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        locations:i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber:step,
      xIsNext: (step%2) === 0,
    });
  }

  reverseStep(){
    this.setState({reverse : !this.state.reverse});
  }

  constructor(props) {
    super(props);
    this.state = {
      stepNumber: 0,
      history: [{
        squares: Array(9).fill(null),
        locations: null,
      }],
      xIsNext: true,
      reverse: false,
    };
    this.reverseStep = this.reverseStep.bind(this);
  }
  render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step,move) => {
        const showMove = this.state.reverse?history.length - 1 - move:move;
        const desc = showMove?
        "step #"+showMove + " Go to move (" +parseInt(history[showMove].locations/3) + "," + parseInt(history[showMove].locations%3) +")" : "Start Game";
        return (
          <li key = {showMove}>
          <button style={this.state.stepNumber===showMove?{'fontWeight': 'bold', 'color':'red'}:{}} onClick={ ()=>this.jumpTo(showMove) }>{desc}</button>
        </li>
        );
      });

      let status;
      if (winner) {
        status = 'Winner: ' + current.squares[winner[0]];
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
  
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winner = {winner}
            row = {3}
            squares={current.squares}
            onClick={(i)=> this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status }</div>
          <button onClick = {this.reverseStep}> {this.state.reverse?"逆序":"正序"} </button>
          <ul>{moves}</ul>
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

function calculateWinner(squares) {
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
      return lines[i];
    }
  }
  return null;
}