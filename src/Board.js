import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

class Board extends Component {
  constructor() {
    super();
    this.state = {
      height: 10,
      width: 10,
      cells: [],
      totalCount: 10,
      marioPosition: {},
      steps: 0,
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  initBoard = (ht, wd) => {
    let tempcells = [...this.state.cells];
    for (let i = 0; i < ht; i++) {
      let cell_row = [];
      for (let j = 0; j < wd; j++) {
        let cell_col = {
          x: i,
          y: j,
          hasFood: false,
          hasMario: false,
        };
        cell_row.push(cell_col);
      }
      tempcells.push(cell_row);
    }

    this.setState({
      cells: tempcells,
      height: ht,
      width: wd,
    });
    console.log(this.state.cells);
  };

  setMario = () => {
    let flag = false;
    let updateCells = [...this.state.cells];
    let x, y;
    while (!flag) {
      y = this.getRandom(0, this.state.width - 1);
      x = this.getRandom(0, this.state.height - 1);
      if (!updateCells[x][y].hasFood) {
        flag = true;
        let tempCell = { ...updateCells[x][y] };
        tempCell.hasMario = true;
        updateCells = this.updateCellsList(tempCell, updateCells);
      }
    }

    this.setState({
      cells: updateCells,
      marioPosition: {
        x: x,
        y: y,
      },
    });
  };

  setMushrooms = () => {
    let updateCells = [...this.state.cells];
    let i = 0;
    while (i < this.state.totalCount) {
      let y = this.getRandom(0, this.state.width - 1);
      let x = this.getRandom(0, this.state.height - 1);
      if (!updateCells[x][y].hasFood) {
        i++;
        let tempCell = { ...updateCells[x][y] };
        tempCell.hasFood = true;
        updateCells = this.updateCellsList(tempCell, updateCells);
      }
    }
    this.setState({
      cells: updateCells,
    });
  };
  getRandom = (minimum, maximum) => {
    var randomnumber =
      Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    return randomnumber;
  };
  renderCell = () => {
    return (
      <div>
        {this.state.cells.map((cell_row, rowIndex) => {
          return (
            <div key={rowIndex} className="cell_row_display">
              {cell_row.map((cell, colIndex) => {
                return (
                  <div key={colIndex} className="cell_column_display">
                    <Cell value={cell} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  handleKeyDown(event) {
    event.stopPropagation();
    event = event || window.event;
    let x = this.state.marioPosition.x;
    let y = this.state.marioPosition.y;
    let prevMarioCell = { ...this.state.cells[x][y] };
    if (event.keyCode === 38) {
      //up arrow
      if (x === 0) {
        return;
      }
      x--;
      this.moveMario(x, y, prevMarioCell);
    } else if (event.keyCode === 40) {
      // down arrow
      if (x === this.state.height - 1) {
        return;
      }
      x++;
      this.moveMario(x, y, prevMarioCell);
    } else if (event.keyCode === 37) {
      // left arrow
      if (y === 0) {
        return;
      }
      y--;
      this.moveMario(x, y, prevMarioCell);
    } else if (event.keyCode === 39) {
      // right arrow
      if (y === this.state.width - 1) {
        return;
      }
      y++;
      this.moveMario(x, y, prevMarioCell);
    }
  }
  updateCellsList(tempCell, updateCells) {
    let cells = updateCells.map((rowCell, rowIndex) => {
      if (rowIndex === tempCell.x) {
        return rowCell.map((colCell, colIndex) => {
          if (colIndex === tempCell.y) {
            return { ...tempCell };
          } else {
            return colCell;
          }
        });
      } else {
        return rowCell;
      }
    });
    return cells;
  }
  moveMario = (x, y, prevMarioCell) => {
    if (prevMarioCell === undefined) {
      return;
    }
    let updateCells = [...this.state.cells];
    let totalCount = this.state.totalCount;
    let stepCount = this.state.steps;
    prevMarioCell.hasMario = false;
    updateCells = this.updateCellsList(prevMarioCell, updateCells);
    //updating new mario cell position
    let currentMarioCell = { ...updateCells[x][y] };
    currentMarioCell.hasMario = true;
    if (currentMarioCell.hasFood) {
      totalCount--;
    }
    currentMarioCell.hasFood = false;

    updateCells = this.updateCellsList(currentMarioCell, updateCells);
    stepCount = stepCount + 1;
    this.setState({
      cells: updateCells,
      totalCount: totalCount,
      marioPosition: {
        x: x,
        y: y,
      },
      steps: stepCount,
    });

    if (this.state.totalCount === 0) setTimeout(this.gameState, 0);
  };
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
    let height = prompt("Enter height", "");
    let width = prompt("Enter widht", "");
    let ht = parseInt(height);
    let wd = parseInt(width);
    this.initBoard(ht, wd);
    setTimeout(this.setMushrooms, 0);
    setTimeout(this.setMario, 0);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }
  gameState = () => {
    if (this.state.totalCount === 0) {
      alert(`Game Over in ${this.state.steps}`);
    }
  };
  render() {
    return (
      <div className="container_board">
        <div className="board_display">
          <h1>Maze game</h1>
          <h4>Steps : {this.state.steps}</h4>
          <div>{this.renderCell()}</div>
        </div>
      </div>
    );
  }
}

export default Board;
