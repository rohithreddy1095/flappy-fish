# Flappy Fish: Technical Explanation

This document provides a technical overview of the Flappy Fish game, explaining its architecture and how the components work.

## Project Architecture

The Flappy Fish game is built using React and JavaScript, with the game logic separated into a GameEngine class. The project structure consists of a main App component that interacts with the GameEngine to manage the game state and rendering.

## Component Breakdown

### App (App.js)

The App component is the core of the application, handling rendering and user input.

Key features:
- Initializes and interacts with the GameEngine
- Manages game rendering based on the state from GameEngine
- Handles user input (click, touch, spacebar press)
- Renders all game elements (fish, pipes, score, messages)

### GameEngine (GameEngine.js)

The GameEngine class encapsulates all the game logic.

Key features:
- Manages game state (not started, playing, game over)
- Handles fish movement and pipe generation
- Implements collision detection
- Manages score

## Game Logic

The main game logic is implemented in the GameEngine class:

1. Game Loop: The App component uses setInterval to create a game tick that calls the GameEngine's tick method every 24ms.

2. Fish Movement:
   - The fish's vertical position is updated based on user input (handled in the App component).
   - Gravity is simulated by incrementing the fish's vertical position each game tick.

3. Pipe Generation:
   - Pipes are generated at regular intervals and move from right to left across the screen.
   - The gap between pipes narrows as the score increases, increasing difficulty.

4. Collision Detection:
   - Pixel-accurate collision detection is implemented between the fish and pipes.
   - Collisions with the top or bottom of the screen are also checked.

5. Score Tracking:
   - The score is incremented as the fish successfully passes through pipe gaps.

6. Difficulty Progression:
   - The game's difficulty increases over time by increasing pipe speed and narrowing gaps.

## State Management

The game uses React's useState and useEffect hooks for state management and side effects in the App component:

- useState: Manages the GameEngine instance and the current game state.
- useEffect: 
  - Sets up the game loop interval
  - Handles window resizing
  - Sets up and cleans up event listeners for keyboard input

The GameEngine class manages its own internal state, which is accessed by the App component through the getState method.

## Responsive Design

The game is designed to be responsive, adapting to different screen sizes:

- Window height is tracked and updated on resize, and passed to the GameEngine.
- Game objects and speeds are scaled relative to the window height.

## User Input

The game responds to multiple input methods:
- Mouse clicks
- Touch events (for mobile devices)
- Spacebar key press

These inputs are handled in the App component and communicated to the GameEngine.

## Rendering

The game uses CSS for rendering game objects:
- The fish is created using CSS shapes and positioned absolutely.
- Pipes are div elements with CSS styling to create the appearance of seaweed or coral.

## Conclusion

Flappy Fish demonstrates the use of React hooks and a separate game engine class to create an interactive game. This architecture separates concerns, with the App component handling rendering and input, while the GameEngine manages the game logic and state.