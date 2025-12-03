import React, { useState, useEffect } from "react";
import Board from './components/Board';
import Controls from './components/Controls';
import './App.css';

const App = () => {
  // --- STATE ---
  const [board, setBoard] = useState(Array(9).fill(0).map(() => Array(9).fill(0)));
  const [initial, setInitial] = useState(Array(9).fill(0).map(() => Array(9).fill(0)));
  const [errors, setErrors] = useState(new Set());
  const [selectedCell, setSelectedCell] = useState(null);
  
  // Modes
  const [gameMode, setGameMode] = useState('mode3'); 
  const [mode, setMode] = useState('input'); 
  const [status, setStatus] = useState("");
  const [aiMoves, setAiMoves] = useState(new Set()); 

  const backendUrl = 'http://127.0.0.1:5000'; 

  // --- API INTERACTION ---

  // 1. Validate Board (Real-time error checking)
  useEffect(() => {
    const validateFromServer = async () => {
      const isEmpty = board.every(row => row.every(cell => cell === 0));
      if (isEmpty) {
        setErrors(new Set());
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/api/validate_board`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ board })
        });
        
        if (res.ok) {
            const data = await res.json();
            setErrors(new Set(data.errors));
        }
      } catch (error) {
        // Fail silently
      }
    };

    const timeoutId = setTimeout(() => validateFromServer(), 200);
    return () => clearTimeout(timeoutId);
  }, [board]);

 const handleSolve = async () => {
  try {
    setStatus("Agent is thinking...");

    const res = await fetch(`${backendUrl}/api/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board })
    });

    const data = await res.json();

    // Always show the AC-3 processed board
    const acBoard = data.solution;
    setBoard(acBoard);

    // Highlight cells filled by AC-3
    const newAiMoves = new Set();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0 && acBoard[r][c] !== 0) {
          newAiMoves.add(`${r}-${c}`);
        }
      }
    }
    setAiMoves(newAiMoves);

   setStatus(data.solved ? "Puzzle Solved!" : "No solution exists.");

  } catch (error) {
    console.error("Error solving:", error);
    setStatus("Error connecting to backend server.");
  }
};

  // 3. Generate Random Puzzle
 const handleGenerate = async (difficulty = "intermediate") => {
  try {
    setStatus("Generating...");
    const res = await fetch(`${backendUrl}/api/generate?difficulty=${difficulty}`);
    const data = await res.json();
    setBoard(data.board);
    setInitial(data.board); // lock prefilled numbers
    setErrors(new Set());
    setAiMoves(new Set());
    setStatus(`New ${difficulty} puzzle generated!`);
  } catch (error) {
    console.error("Error generating puzzle:", error);
    setStatus("Error: Is Backend running?");
  }
};

  // --- UI HANDLERS ---

  const handleCellClick = (row, col) => {
    if (mode === 'input') setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell || mode !== 'input') return;
    const { row, col } = selectedCell;
    
    // Create deep copy
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);
  };

  const handleKeyPress = (e) => {
    if (!selectedCell || mode !== 'input') return;
    const num = parseInt(e.key);
    if (!isNaN(num) && num >= 0 && num <= 9) handleNumberInput(num);
    if (e.key === 'Backspace' || e.key === 'Delete') handleNumberInput(0);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, mode, board]);

  const resetBoard = () => {
    setBoard(Array(9).fill(0).map(() => Array(9).fill(0)));
    setInitial(Array(9).fill(0).map(() => Array(9).fill(0)));
    setErrors(new Set());
    setAiMoves(new Set());
    setSelectedCell(null);
    setStatus("");
  };

  const handleGameModeChange = (newGameMode) => {
    setGameMode(newGameMode);
    resetBoard();
    
    // Mode 1: AI Demo -> Locked input
    if (newGameMode === 'mode1') {
      setMode('locked');
    } else {
      setMode('input');
    }
  };

  return (
    <div className="app">
      <div className="background-blobs">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
        <div className="blob blob4"></div>
      </div>

      <div className="content">
        <h1 className="title">🎨 AI Sudoku Solver</h1>
        
        <div className="status-bar-container">
            {status && <div className="status-pill">{status}</div>}
        </div>

        <div className="main-grid">
          <div className="board-container">
            <Board
              board={board}
              initial={initial}
              errors={errors}
              selectedCell={selectedCell}
              onCellClick={handleCellClick}
              // aiMoves is passed down to highlight AI cells in green
              aiMoves={aiMoves} 
            />
          </div>
          <Controls
            mode={mode}
            gameMode={gameMode}
            onSolve={handleSolve}
            onGenerate={handleGenerate}
            onReset={resetBoard}
            onGameModeChange={handleGameModeChange}
          />
          
        </div>
      </div>
    </div>
  );
};

export default App;