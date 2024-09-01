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

  const handleKeyDown = useCallback((event) => {
    if (gameEngine && !gameState.gameOver) {
      switch (event.code) {
        case 'ArrowUp':
        case 'Space':
          gameEngine.swim();
          break;
        case 'ArrowDown':
          gameEngine.move('down');
          break;
        case 'ArrowLeft':
          gameEngine.move('left');
          break;
        case 'ArrowRight':
          gameEngine.move('right');
          break;
      }
      setGameState(gameEngine.getState());
    }
  }, [gameEngine, gameState]);

  const handleKeyUp = useCallback((event) => {
    if (gameEngine && !gameState.gameOver) {
      switch (event.code) {
        case 'ArrowLeft':
        case 'ArrowRight':
          gameEngine.stopMove(event.code === 'ArrowLeft' ? 'left' : 'right');
          break;
        // We don't handle up/down key up events as vertical movement is controlled by gravity and swim
      }
      setGameState(gameEngine.getState());
    }
  }, [gameEngine, gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleClick = useCallback(() => {
    if (gameEngine) {
      if (gameState.gameOver) {
        gameEngine.reset();
      } else {
        gameEngine.swim();
      }
      setGameState(gameEngine.getState());
    }
  }, [gameEngine, gameState]);

  if (!gameState) return null;

  return (
    <div className="App" onClick={handleClick}>
      <div 
        className="fish" 
        style={{ 
          top: `${gameState.fishY}px`, 
          left: `${gameState.fishX}px`,
          transform: `rotate(${gameEngine.velocityY * 3}deg)`
        }}
      >
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
      <button className="jump-button" onClick={() => gameEngine.jump()}>Swim Up</button>
    </div>
  );
}

export default App;
