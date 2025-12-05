import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react';

const ACVisualizer = ({ history, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  React.useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= history.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying, history.length]);

  if (!history || history.length === 0) {
    return (
      <div className="ac-overlay">
        <div className="ac-empty-message">
          <p>No AC-3 steps recorded yet.</p>
          <button onClick={onClose} className="ac-btn-primary">Close</button>
        </div>
      </div>
    );
  }

  const step = history[currentStep];
  const gridSize = step.board_before.length;

  const renderBoard = (board, highlightCells = []) => {
    return (
      <div 
        className="ac-board"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 40px)`
        }}
      >
        {board.map((row, i) => 
          row.map((cell, j) => {
            const isCell1 = highlightCells.some(c => c[0] === i && c[1] === j && c[2] === 1);
            const isCell2 = highlightCells.some(c => c[0] === i && c[1] === j && c[2] === 2);
            
            let cellClass = 'ac-cell';
            if (cell !== 0) cellClass += ' ac-cell-filled';
            if (isCell1) cellClass += ' ac-cell-highlight-1';
            if (isCell2) cellClass += ' ac-cell-highlight-2';
            
            return (
              <div key={`${i}-${j}`} className={cellClass}>
                {cell === 0 ? '' : cell}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderDomain = (domain, title, className, removedValues = []) => {
    return (
      <div className={`ac-domain ${className}`}>
        <h4>{title}</h4>
        <div className="ac-domain-values">
          {domain.map(val => {
            const isRemoved = removedValues.includes(val);
            return (
              <span
                key={val}
                className={isRemoved ? 'ac-value ac-value-removed' : 'ac-value'}
              >
                {val}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="ac-overlay">
      <style>{`
        .ac-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .ac-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          overflow: auto;
        }

        .ac-header {
          position: sticky;
          top: 0;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
        }

        .ac-header h2 {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }

        .ac-header p {
          font-size: 14px;
          color: #6b7280;
          margin: 4px 0 0 0;
        }

        .ac-close-btn {
          padding: 8px;
          background: transparent;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .ac-close-btn:hover {
          background-color: #f3f4f6;
        }

        .ac-content {
          padding: 24px;
        }

        .ac-section {
          margin-bottom: 24px;
        }

        .ac-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }

        .ac-board-container {
          display: flex;
          justify-content: center;
        }

        .ac-board {
          display: inline-grid;
          gap: 2px;
          background-color: #1f2937;
          padding: 4px;
          border-radius: 4px;
        }

        .ac-cell {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          background-color: white;
        }

        .ac-cell-filled {
          background-color: #e5e7eb;
          color: #374151;
        }

        .ac-cell-highlight-1 {
          background-color: #dbeafe !important;
          box-shadow: inset 0 0 0 4px #3b82f6;
        }

        .ac-cell-highlight-2 {
          background-color: #f3e8ff !important;
          box-shadow: inset 0 0 0 4px #a855f7;
        }

        .ac-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 12px;
          font-size: 14px;
        }

        .ac-legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ac-legend-box {
          width: 16px;
          height: 16px;
          border-radius: 2px;
        }

        .ac-legend-box-1 {
          background-color: #3b82f6;
        }

        .ac-legend-box-2 {
          background-color: #a855f7;
        }

        .ac-domains-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .ac-domain {
          padding: 16px;
          border-radius: 8px;
          border: 2px solid;
        }

        .ac-domain h4 {
          font-weight: 600;
          margin: 0 0 8px 0;
          font-size: 14px;
        }

        .ac-domain-1 {
          border-color: #93c5fd;
          background-color: #eff6ff;
        }

        .ac-domain-2 {
          border-color: #d8b4fe;
          background-color: #faf5ff;
        }

        .ac-domain-after {
          border-color: #86efac;
          background-color: #f0fdf4;
        }

        .ac-domain-removed {
          border-color: #fca5a5;
          background-color: #fef2f2;
        }

        .ac-domain-removed h4 {
          color: #991b1b;
        }

        .ac-domain-values {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .ac-value {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          background-color: #f3f4f6;
          color: #1f2937;
        }

        .ac-value-removed {
          background-color: #ef4444;
          color: white;
          text-decoration: line-through;
        }

        .ac-controls {
          position: sticky;
          bottom: 0;
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
          padding: 16px 24px;
        }

        .ac-controls-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .ac-btn {
          padding: 8px;
          border-radius: 50%;
          background: white;
          border: 2px solid #d1d5db;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ac-btn:hover:not(:disabled) {
          background-color: #f3f4f6;
        }

        .ac-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ac-btn-play {
          padding: 8px 24px;
          border-radius: 9999px;
          background-color: #2563eb;
          color: white;
          border: none;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.2s;
        }

        .ac-btn-play:hover {
          background-color: #1d4ed8;
        }

        .ac-progress-bar {
          margin-top: 16px;
          width: 100%;
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
        }

        .ac-progress-fill {
          height: 100%;
          background-color: #2563eb;
          transition: width 0.3s;
        }

        .ac-empty-message {
          background: white;
          border-radius: 8px;
          padding: 24px;
          max-width: 400px;
        }

        .ac-btn-primary {
          margin-top: 16px;
          padding: 8px 16px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .ac-btn-primary:hover {
          background-color: #1d4ed8;
        }
      `}</style>

      <div className="ac-container">
        <div className="ac-header">
          <div>
            <h2>AC-3 Constraint Propagation</h2>
            <p>Step {currentStep + 1} of {history.length}</p>
          </div>
          <button onClick={onClose} className="ac-close-btn">
            <X />
          </button>
        </div>

        <div className="ac-content">
          <div className="ac-section">
            <h3>Board Before Revision</h3>
            <div className="ac-board-container">
              {renderBoard(step.board_before, [
                [...step.cell_1, 1],
                [...step.cell_2, 2]
              ])}
            </div>
            <div className="ac-legend">
              <div className="ac-legend-item">
                <div className="ac-legend-box ac-legend-box-1"></div>
                <span>Cell 1: ({step.cell_1[0]}, {step.cell_1[1]}) - Being Revised</span>
              </div>
              <div className="ac-legend-item">
                <div className="ac-legend-box ac-legend-box-2"></div>
                <span>Cell 2: ({step.cell_2[0]}, {step.cell_2[1]}) - Constraint Source</span>
              </div>
            </div>
          </div>

          <div className="ac-section">
            <div className="ac-domains-grid">
              {renderDomain(
                step.cell_1_domain_before,
                `Cell 1 Domain Before: [${step.cell_1[0]}, ${step.cell_1[1]}]`,
                'ac-domain-1'
              )}
              {renderDomain(
                step.cell_2_domain,
                `Cell 2 Domain: [${step.cell_2[0]}, ${step.cell_2[1]}]`,
                'ac-domain-2'
              )}
            </div>
          </div>

          {step.removed_values && step.removed_values.length > 0 && (
            <div className="ac-section">
              {renderDomain(
                step.removed_values,
                'Removed Values',
                'ac-domain-removed'
              )}
            </div>
          )}

          <div className="ac-section">
            {renderDomain(
              step.cell_1_domain_after,
              `Cell 1 Domain After Revision: [${step.cell_1[0]}, ${step.cell_1[1]}]`,
              'ac-domain-after',
              step.removed_values
            )}
          </div>

          <div className="ac-section">
            <h3>Board After Revision</h3>
            <div className="ac-board-container">
              {renderBoard(step.board_after, [
                [...step.cell_1, 1],
                [...step.cell_2, 2]
              ])}
            </div>
          </div>
        </div>

        <div className="ac-controls">
          <div className="ac-controls-buttons">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="ac-btn"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="ac-btn-play"
            >
              {isPlaying ? (
                <>
                  <Pause size={16} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={16} />
                  Play
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentStep(Math.min(history.length - 1, currentStep + 1))}
              disabled={currentStep === history.length - 1}
              className="ac-btn"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="ac-progress-bar">
            <div
              className="ac-progress-fill"
              style={{ width: `${((currentStep + 1) / history.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ACVisualizer;