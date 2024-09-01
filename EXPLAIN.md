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
- Handles user input (click, touch, spacebar press, arrow keys)
- Renders all game elements (fish, pipes, bubbles, score, messages)
- Manages sound effects

### GameEngine (GameEngine.js)

The GameEngine class encapsulates all the game logic.

Key features:
- Manages game state (not started, playing, game over)
- Handles fish movement, including gravity and multi-directional control
- Implements pipe generation and movement
- Manages collision detection
- Handles scoring system
- Generates and updates bubble animations

## Game Logic

The main game logic is implemented in the GameEngine class:

1. Game Loop: The App component uses setInterval to create a game tick that calls the GameEngine's tick method every 24ms.

2. Fish Movement:
   - Gravity is simulated by incrementing the fish's vertical velocity each game tick.
   - The fish's position is updated based on its velocity (affected by gravity and user input).
   - Arrow key controls allow for multi-directional movement:
     - Up arrow or spacebar triggers the 'swim' action, counteracting gravity.
     - Down arrow increases downward velocity.
     - Left and right arrows move the fish horizontally.
   - Horizontal movement stops when left/right keys are released.
   - Vertical movement is always affected by gravity unless counteracted by swimming.

3. Pipe Generation:
   - Pipes are generated at regular intervals and move from right to left across the screen.
   - The gap between pipes narrows as the score increases, increasing difficulty.

4. Collision Detection:
   - Collisions between the fish and pipes are checked each tick.
   - Collisions with the top or bottom of the screen are also checked.

5. Score Tracking:
   - The score is incremented as the fish successfully passes through pipe gaps.
   - The scoring system works correctly regardless of the fish's vertical position or movement method.
   - Each pipe is marked as 'passed' to ensure it's only scored once.

6. Difficulty Progression:
   - The game's difficulty increases over time by increasing pipe speed and narrowing gaps.

7. Bubble Animation:
   - Bubbles are generated randomly and move upwards.
   - Bubbles are created with varying sizes and speeds.
   - Bubbles are removed when they move off-screen.

8. Sound Effects:
   - A sound effect is played when the fish successfully passes through a pipe.

## State Management

The game uses React's useState and useEffect hooks for state management and side effects in the App component:

- useState: Manages the GameEngine instance, the current game state, and the previous score (for sound effect triggering)
- useEffect: 
  - Sets up the game loop interval
  - Handles window resizing
  - Sets up and cleans up event listeners for keyboard input
  - Manages sound effect playback

The GameEngine class manages its own internal state, which is accessed by the App component through the getState method. This state now includes additional properties for bubbles.

## User Input

The game responds to multiple input methods:
- Mouse clicks
- Touch events (for mobile devices)
- Spacebar key press (for upward swimming)
- Arrow keys (for multi-directional movement)

These inputs are handled in the App component and communicated to the GameEngine through specific methods like 'swim', 'move', and 'stopMove'.

## Rendering

The game uses CSS for rendering game objects:
- The fish is created using CSS shapes and positioned absolutely.
- Pipes are div elements with CSS styling to create the appearance of seaweed or coral.
- The fish's rotation is adjusted based on its vertical velocity for a more dynamic appearance.
- Bubbles are rendered as div elements with CSS animations for movement and scaling.

## Sound Effects

The game uses the Web Audio API to play a sound effect when the fish passes through a pipe. The sound is loaded as an audio file and played using an Audio object.

## Conclusion

Flappy Fish demonstrates the use of React hooks and a separate game engine class to create an interactive game. This architecture separates concerns, with the App component handling rendering, input, and sound, while the GameEngine manages the game logic and state. The addition of bubble animations and sound effects enhances the game's atmosphere, providing a more immersive underwater experience.