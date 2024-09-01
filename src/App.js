import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import { GameEngine } from './game/GameEngine';

function App() {
  const [gameEngine, setGameEngine] = useState(null);
  const [gameState, setGameState] = useState(null);
  const windowHeight = useRef(window.innerHeight);

  useEffect(() => {
    const engine = new GameEngine(windowHeight.current);
    setGameEngine(engine);
    setGameState(engine.getState());

    const handleResize = () => {
      windowHeight.current = window.innerHeight;
      engine.windowHeight = windowHeight.current;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gameTick = useCallback(() => {
    if (gameEngine) {
      gameEngine.tick();
      setGameState(gameEngine.getState());
    }
  }, [gameEngine]);

  useEffect(() => {
    const interval = setInterval(gameTick, 24);
    return () => clearInterval(interval);
  }, [gameTick]);

  const handleInput = useCallback(() => {
    if (gameEngine) {
      if (gameState.gameOver) {
        gameEngine.reset();
      } else {
        gameEngine.jump();
      }
      setGameState(gameEngine.getState());
    }
  }, [gameEngine, gameState]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        handleInput();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleInput]);

  if (!gameState) return null;

  return (
    <div className="App" onClick={handleInput}>
      <div className="fish" style={{ top: `${gameState.fishPosition}px`, left: `${gameEngine.FISH_LEFT}px` }}>
        <div className="fish-eye"></div>
        <div className="fish-tail"></div>
      </div>
      {gameState.pipes.map((pipe, index) => (
        <React.Fragment key={index}>
          <div className="pipe top" style={{ left: `${pipe.left}px`, height: `${pipe.topHeight}px` }}>
            <div className="tentacles"></div>
          </div>
          <div className="pipe bottom" style={{ left: `${pipe.left}px`, height: `${pipe.bottomHeight}px`, top: `${windowHeight.current - pipe.bottomHeight}px` }}>
            <div className="tentacles"></div>
          </div>
        </React.Fragment>
      ))}
      <div className="score">Score: {gameState.score}</div>
      {!gameState.gameHasStarted && <div className="message">Click to start</div>}
      {gameState.gameOver && <div className="message">Game Over! Click to restart</div>}
      <button className="jump-button" onClick={handleInput}>Swim Up</button>
    </div>
  );
}

export default App;
