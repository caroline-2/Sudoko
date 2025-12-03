import React from "react";

const Cell = ({ value, row, col, isInitial, hasError, isSelected, isAiMove, onClick }) => {
  let classes = "cell";

  // Structural Borders
  if (row % 3 === 0) classes += " top-border";
  if (col % 3 === 0) classes += " left-border";
  if (row === 8) classes += " bottom-border";
  if (col === 8) classes += " right-border";

  // State Styles
  if (hasError) classes += " error";
  else if (isInitial) classes += " initial";
  else if (isAiMove) classes += " ai-move"; // <--- Added Green Highlight
  else if (value !== 0) classes += " filled";
  
  if (isSelected) classes += " selected";

  return (
    <div className={classes} onClick={onClick}>
      {value !== 0 ? value : ""}
    </div>
  );
};

export default Cell;