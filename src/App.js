import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

function App() {
  const [fishPosition, setFishPosition] = useState(200);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [pipes, setPipes] = useState([]);
  const windowHeight = useRef(window.innerHeight);

  const FISH_WIDTH = 60;
  const FISH_HEIGHT = 30;
  const PIPE_WIDTH = 70;
  const FISH_LEFT = 50;

  useEffect(() => {
    windowHeight.current = window.innerHeight;
    const handleResize = () => {
      windowHeight.current = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gameTick = useCallback(() => {
    if (gameHasStarted && !gameOver) {
      setFishPosition((prevPosition) => {
        const newPosition = prevPosition + 2;
        return Math.min(newPosition, windowHeight.current - FISH_HEIGHT);
      });

      const speed = 2 * (1 + Math.min(score / 10, 4));

      setPipes((prevPipes) => {
        const newPipes = prevPipes.map(pipe => ({ ...pipe, left: pipe.left - speed }));
        
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].left < window.innerWidth * 0.75) {
          const gap = 250 - Math.min(score * 5, 100);
          const minHeight = 100;
          const maxHeight = windowHeight.current - gap - minHeight;
          const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
          const bottomHeight = windowHeight.current - topHeight - gap;
          newPipes.push({ left: window.innerWidth, topHeight, bottomHeight });
        }
        return newPipes.filter(pipe => pipe.left > -PIPE_WIDTH);
      });

      // Pixel-accurate collision detection
      const fishRight = FISH_LEFT + FISH_WIDTH;
      const fishTop = fishPosition;
      const fishBottom = fishPosition + FISH_HEIGHT;

      pipes.forEach(pipe => {
        const pipeLeft = pipe.left;
        const pipeRight = pipe.left + PIPE_WIDTH;
        const topPipeBottom = pipe.topHeight;
        const bottomPipeTop = windowHeight.current - pipe.bottomHeight;

        if (
          fishRight > pipeLeft &&
          FISH_LEFT < pipeRight &&
          (fishTop < topPipeBottom || fishBottom > bottomPipeTop)
        ) {
          console.log('Collision detected!');
          console.log(`Fish: top=${fishTop}, bottom=${fishBottom}, left=${FISH_LEFT}, right=${fishRight}`);
          console.log(`Pipe: left=${pipeLeft}, right=${pipeRight}, topBottom=${topPipeBottom}, bottomTop=${bottomPipeTop}`);
          setGameOver(true);
        }
      });

      // Update score
      if (pipes.length > 0 && pipes[0].left + PIPE_WIDTH < FISH_LEFT && pipes[0].left + PIPE_WIDTH >= FISH_LEFT - speed) {
        setScore(prevScore => prevScore + 1);
      }
    }
  }, [gameHasStarted, gameOver, pipes, fishPosition, score]);

  useEffect(() => {
    const interval = setInterval(gameTick, 24);
    return () => clearInterval(interval);
  }, [gameTick]);

  const handleInput = useCallback(() => {
    if (!gameHasStarted) {
      setGameHasStarted(true);
    }
    if (!gameOver) {
      setFishPosition((prevPosition) => Math.max(0, prevPosition - 60));
    } else {
      // Reset game
      setGameHasStarted(false);
      setGameOver(false);
      setFishPosition(200);
      setPipes([]);
      setScore(0);
    }
  }, [gameHasStarted, gameOver]);

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

  return (
    <div className="App" onClick={handleInput}>
      <div className="fish" style={{ top: `${fishPosition}px`, left: `${FISH_LEFT}px` }}>
        <div className="fish-eye"></div>
        <div className="fish-tail"></div>
      </div>
      {pipes.map((pipe, index) => (
        <React.Fragment key={index}>
          <div className="pipe top" style={{ left: `${pipe.left}px`, height: `${pipe.topHeight}px` }}>
            <div className="tentacles"></div>
          </div>
          <div className="pipe bottom" style={{ left: `${pipe.left}px`, height: `${pipe.bottomHeight}px`, top: `${windowHeight.current - pipe.bottomHeight}px` }}>
            <div className="tentacles"></div>
          </div>
        </React.Fragment>
      ))}
      <div className="score">Score: {score}</div>
      {!gameHasStarted && <div className="message">Click to start</div>}
      {gameOver && <div className="message">Game Over! Click to restart</div>}
      <button className="jump-button" onClick={handleInput}>Swim Up</button>
    </div>
  );
}

export default App;
