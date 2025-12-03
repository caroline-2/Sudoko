import React, { useState } from "react";
import { Sparkles, Cpu, Zap } from "lucide-react";

const Controls = ({ 
  gameMode, 
  onReset, 
  onGameModeChange,
  onSolve,
  onGenerate
}) => {
  const [difficulty, setDifficulty] = useState("");

  return (
    <div className="controls">
      {/* --- 1. GAME MODE SELECTOR --- */}
      <div className="section">
        <h3><Sparkles size={20} /> Game Mode</h3>
        <select value={gameMode} onChange={(e) => onGameModeChange(e.target.value)}>
          <option value="mode1">Mode 1: AI Demo (Generate & Solve)</option>
          <option value="mode2">Mode 2: Input & AI Solve</option>
          <option value="mode3">Mode 3: User Play</option>
        </select>
      </div>

      {/* --- Difficulty buttons (only Mode 1 & 3) --- */}
      {(gameMode === "mode1" || gameMode === "mode3") && (
        <div className="difficulty-buttons">
          <button onClick={() => setDifficulty("easy")}>Easy</button>
          <button onClick={() => setDifficulty("intermediate")}>Intermediate</button>
          <button onClick={() => setDifficulty("hard")}>Hard</button>
        </div>
      )}

      {/* --- Generate button (only enabled after difficulty selected) --- */}
      {(gameMode === "mode1" || gameMode === "mode3") && (
        <div className="section">
          <button
            onClick={() => onGenerate(difficulty)}
            disabled={!difficulty}
            className="btn-generate"
            style={{ width: '100%', marginTop: '10px' }}
          >
            <Cpu size={16} /> Generate New Puzzle
          </button>
        </div>
      )}

      {/* --- MODE 1 SPECIFIC: AI DEMO --- */}
      {gameMode === 'mode1' && (
        <div className="section">
          <h3>AI Demo Controls</h3>
          <p className="description">Generate a random puzzle, then let AI solve it.</p>
          
          <button 
            onClick={onSolve} 
            className="btn-ac3" 
            style={{ width: '100%' }}
          >
            <Zap size={16} /> AI Solve
          </button>
        </div>
      )}

      {/* --- MODE 2 SPECIFIC: USER INPUT -> AI SOLVE --- */}
      {gameMode === 'mode2' && (
        <div className="section">
          <h3>Solver Controls</h3>
          <p className="description">Type your puzzle, then click Solve.</p>
          
          <button onClick={onSolve} className="btn-ac3" style={{ width: '100%' }}>
             <Zap size={16} /> AI Solve Board
          </button>
        </div>
      )}

      {/* --- DYNAMIC INSTRUCTIONS --- */}
      <div className="instructions">
        {gameMode === 'mode1' && <p>🤖 <strong>Mode 1:</strong> AI generates and solves.</p>}
        {gameMode === 'mode2' && <p>⌨️ <strong>Mode 2:</strong> Input your own puzzle.</p>}
        {gameMode === 'mode3' && <p>🎮 <strong>Mode 3:</strong> Solve the puzzle yourself.</p>}
      </div>
    </div>
  );
};

export default Controls;
