import React from "react";
import Cell from "./Cell";

const Board = ({ board, initial, errors, selectedCell, onCellClick, aiMoves }) => {
  return (
    <div className="board">
      {board.map((row, i) =>
        row.map((cell, j) => (
          <Cell
            key={`${i}-${j}`}
            value={cell}
            row={i}
            col={j}
            isInitial={initial[i][j] !== 0}
            hasError={errors.has(`${i}-${j}`)}
            isSelected={selectedCell?.row === i && selectedCell?.col === j}
            isAiMove={aiMoves && aiMoves.has(`${i}-${j}`)} // <--- Check if AI placed this
            onClick={() => onCellClick(i, j)}
          />
        ))
      )}
    </div>
  );
};

export default Board;