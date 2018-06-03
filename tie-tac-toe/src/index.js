import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Guide： https://doc.react-china.org/tutorial/tutorial.html#%E7%8A%B6%E6%80%81%E6%8F%90%E5%8D%87

// 代码阅读步骤：
//     1.通过Props传递数据： Line 
//     2.给组建添加交互功能： Line 
//     3.状态提升：
//     4.函数定义组件
//     5.轮流落子
//          6.保存历史记录
//          7.实现时间旅行

// 2.给组建添加交互功能
// 2.1
// 修改了 <button className="square">， 添加了 onClick功能  onClick={ ()=>alert('click')}
// 注意到这里我们传给 onClick属性的是一个函数方法，假如我们写的是 onClick={alert('click')} 警示框是会立即弹出的,而且你点了还会没反应
// 之后：
// 在 React 组件的构造方法 constructor 当中，你可以通过 this.state 为该组件设置自身的状态数据。我们来试着把棋盘格子变化的数据储存在组件的 state 当中吧：，这之后的一步我们就添加了构造函数

// class Square extends React.Component{
//     // constructor() {
//     //     super(); //必须使用这个东西才能调用正确的this
//     //     this.state = {
//     //         //value: null, //这里不写这一行也可以，如果不写的话系统会根据下面setState的内容新建一个叫做value的variable
//     //     };
//     // }
    
//     render() {
//         return (
//             <button className="square" onClick={ ()=>this.props.onClick() }>
//             {this.props.value}
//             </button>
//         );
//     }
// }
// 4.使用函数定义组件的方法重写square：
// React 专门为像 Square 组件这种只有 render 方法的组件提供的更简便的定义组件的方法就是函数定义组件
// 这里我们把 onClick={() => props.onClick()} 直接修改为 onClick={props.onClick} , 注意不能写成 onClick={props.onClick()} 否则 props.onClick 方法会在 Square 组件渲染时被直接触发而不是等到 Board 组件渲染完成时通过点击触发，又因为此时 Board 组件正在渲染中（即 Board 组件的 render() 方法正在调用），又触发 handleClick(i) 方法调用 setState() 会再次调用 render() 方法导致死循环。
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}



// 1.通过Props传递数据：重点观察Board这个class的写法，Board这个class1可以说是第一阶段的root
// 3.状态提升：添加了构造函数：Board是square的父组建所以我们需要在这里建立构造函数存储square中获得的数据，这里是做了一个array
class Board extends React.Component {
    constructor() {
        super();
        this.state = {
          squares: Array(9).fill(null), //建立空数组原来如此方便
          xIsNext: true,
        };
    }

    handleClick(i){
        const squares = this.state.squares.slice();//slice是浅拷贝

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    renderSquare(i) {
        return (
            <Square 
                value={this.state.squares[i]} //为什么这里还是state？？？？
                onClick={ ()=>this.handleClick(i) }
            />
        );
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div>
                <div className="status">{status}</div>
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

class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }

  // ========================================

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
        return squares[a];
      }
    }
    return null;
  }



ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );