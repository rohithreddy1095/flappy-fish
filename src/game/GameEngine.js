export class GameEngine {
  constructor(windowHeight) {
    this.windowHeight = windowHeight;
    this.FISH_WIDTH = 60;
    this.FISH_HEIGHT = 30;
    this.PIPE_WIDTH = 70;
    this.FISH_START_X = 50;
    this.fishX = this.FISH_START_X;
    this.fishY = 200;
    this.velocityX = 0;
    this.velocityY = 0;
    this.gravity = 0.4;
    this.swimStrength = -7;
    this.maxSpeed = 5;
    this.pipes = [];
    this.score = 0;
    this.gameHasStarted = false;
    this.gameOver = false;
    this.bubbles = [];
  }

  tick() {
    if (this.gameHasStarted && !this.gameOver) {
      // Apply gravity
      this.velocityY += this.gravity;

      // Limit vertical speed
      this.velocityY = Math.max(Math.min(this.velocityY, this.maxSpeed), -this.maxSpeed);

      // Update fish position
      this.fishX += this.velocityX;
      this.fishY += this.velocityY;

      // Constrain fish within screen bounds
      this.fishX = Math.max(0, Math.min(this.fishX, window.innerWidth - this.FISH_WIDTH));
      this.fishY = Math.max(0, Math.min(this.fishY, this.windowHeight - this.FISH_HEIGHT));

      // Update pipes
      const speed = 2 * (1 + Math.min(this.score / 10, 4));
      this.pipes = this.pipes
        .map(pipe => ({ ...pipe, left: pipe.left - speed }))
        .filter(pipe => pipe.left > -this.PIPE_WIDTH);

      // Generate new pipes
      if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].left < window.innerWidth * 0.75) {
        const gap = 250 - Math.min(this.score * 5, 100);
        const minHeight = 100;
        const maxHeight = this.windowHeight - gap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        const bottomHeight = this.windowHeight - topHeight - gap;
        this.pipes.push({ left: window.innerWidth, topHeight, bottomHeight });
      }

      // Check collisions
      for (const pipe of this.pipes) {
        if (
          this.fishX + this.FISH_WIDTH > pipe.left &&
          this.fishX < pipe.left + this.PIPE_WIDTH &&
          (this.fishY < pipe.topHeight || this.fishY + this.FISH_HEIGHT > this.windowHeight - pipe.bottomHeight)
        ) {
          this.gameOver = true;
          return;
        }
      }

      // Update score
      this.updateScore(speed);

      // Update bubbles
      this.updateBubbles();

      // ... (rest of the method remains the same)
    }
  }

  updateScore(speed) {
    const fishRightEdge = this.fishX + this.FISH_WIDTH;
    for (let i = 0; i < this.pipes.length; i++) {
      const pipe = this.pipes[i];
      const pipeRightEdge = pipe.left + this.PIPE_WIDTH;
      
      if (!pipe.passed && fishRightEdge > pipeRightEdge) {
        this.score++;
        pipe.passed = true;
        break;  // Only increment score once per frame
      }
      
      // Remove passed property from pipes that are no longer on screen
      if (pipe.left + this.PIPE_WIDTH < 0) {
        delete pipe.passed;
      }
    }
  }

  swim() {
    if (!this.gameHasStarted) {
      this.gameHasStarted = true;
    }
    if (!this.gameOver) {
      this.velocityY = this.swimStrength;
    }
  }

  move(direction) {
    const speed = 3;
    switch (direction) {
      case 'up':
        this.swim();
        break;
      case 'down':
        this.velocityY = speed;
        break;
      case 'left':
        this.velocityX = -speed;
        break;
      case 'right':
        this.velocityX = speed;
        break;
    }
  }

  stopMove(direction) {
    switch (direction) {
      case 'left':
      case 'right':
        this.velocityX = 0;
        break;
      // We don't stop vertical movement here, as it's controlled by gravity and swim
    }
  }

  jump() {
    if (!this.gameHasStarted) {
      this.gameHasStarted = true;
    }
    if (!this.gameOver) {
      this.velocityY = this.jumpStrength;
    }
  }

  reset() {
    this.gameHasStarted = false;
    this.gameOver = false;
    this.fishX = this.FISH_START_X;
    this.fishY = 200;
    this.velocityX = 0;
    this.velocityY = 0;
    this.pipes = [];
    this.score = 0;
  }

  createBubble() {
    const bubble = {
      left: Math.random() * window.innerWidth,
      top: this.windowHeight + 20, // Start from below the screen
      size: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 1,
    };
    this.bubbles.push(bubble);
  }

  updateBubbles() {
    this.bubbles = this.bubbles.filter(bubble => bubble.top > -bubble.size);
    this.bubbles.forEach(bubble => {
      bubble.top -= bubble.speed;
    });

    if (Math.random() < 0.05) { // Adjust this value to control bubble frequency
      this.createBubble();
    }
  }

  getState() {
    return {
      fishX: this.fishX,
      fishY: this.fishY,
      pipes: this.pipes,
      score: this.score,
      gameHasStarted: this.gameHasStarted,
      gameOver: this.gameOver,
      bubbles: this.bubbles,
    };
  }
}