export class GameEngine {
  constructor(windowHeight) {
    this.windowHeight = windowHeight;
    this.fishPosition = 200;
    this.pipes = [];
    this.score = 0;
    this.gameHasStarted = false;
    this.gameOver = false;
    this.FISH_WIDTH = 60;
    this.FISH_HEIGHT = 30;
    this.PIPE_WIDTH = 70;
    this.FISH_LEFT = 50;
  }

  tick() {
    if (this.gameHasStarted && !this.gameOver) {
      // Move fish
      this.fishPosition = Math.min(this.fishPosition + 2, this.windowHeight - this.FISH_HEIGHT);

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
      const fishRight = this.FISH_LEFT + this.FISH_WIDTH;
      const fishTop = this.fishPosition;
      const fishBottom = this.fishPosition + this.FISH_HEIGHT;

      for (const pipe of this.pipes) {
        const pipeLeft = pipe.left;
        const pipeRight = pipe.left + this.PIPE_WIDTH;
        const topPipeBottom = pipe.topHeight;
        const bottomPipeTop = this.windowHeight - pipe.bottomHeight;

        if (
          fishRight > pipeLeft &&
          this.FISH_LEFT < pipeRight &&
          (fishTop < topPipeBottom || fishBottom > bottomPipeTop)
        ) {
          this.gameOver = true;
          return;
        }
      }

      // Update score
      if (this.pipes.length > 0 && 
          this.pipes[0].left + this.PIPE_WIDTH < this.FISH_LEFT && 
          this.pipes[0].left + this.PIPE_WIDTH >= this.FISH_LEFT - speed) {
        this.score++;
      }
    }
  }

  jump() {
    if (!this.gameHasStarted) {
      this.gameHasStarted = true;
    }
    if (!this.gameOver) {
      this.fishPosition = Math.max(0, this.fishPosition - 60);
    }
  }

  reset() {
    this.gameHasStarted = false;
    this.gameOver = false;
    this.fishPosition = 200;
    this.pipes = [];
    this.score = 0;
  }

  getState() {
    return {
      fishPosition: this.fishPosition,
      pipes: this.pipes,
      score: this.score,
      gameHasStarted: this.gameHasStarted,
      gameOver: this.gameOver,
    };
  }
}