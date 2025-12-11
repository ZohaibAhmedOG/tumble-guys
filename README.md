# 🎮 Tumble Guys

A high-quality Fall Guys-inspired 3D party platformer game built with Three.js and Rapier physics engine.

![Tumble Guys](https://img.shields.io/badge/status-playable-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The game will automatically open in your browser at `http://localhost:3000`

## 🎮 How to Play

### Controls
- **WASD** or **Arrow Keys** - Move your character
- **Space** - Jump
- **ESC** - Pause game
- **Gamepad Support** - Xbox/PlayStation controllers supported

### Objective
Race through obstacle courses to reach the finish line! Compete against AI opponents and try to get the best time.

## 🏁 Game Features

### ✅ Implemented Features

#### Core Gameplay
- ✅ Physics-based character movement with momentum
- ✅ Smooth 3D bean-like characters with cute design
- ✅ Responsive controls (keyboard + gamepad)
- ✅ Camera system that follows the player
- ✅ Real-time position tracking

#### 5 Unique Levels
1. **Dizzy Heights** - Sky theme with spinning platforms and swinging hammers
2. **Slime Climb** - Factory theme with conveyor belts and moving walls
3. **Seesaw Madness** - Playground theme with tilting seesaws
4. **Wipeout Zone** - Beach theme with massive hammer gauntlets
5. **Final Ascent** - Neon space theme combining all obstacle types

#### Dynamic Obstacles
- ✅ Spinning platforms
- ✅ Swinging hammers and pendulums
- ✅ Tilting seesaws
- ✅ Conveyor belts
- ✅ Moving pusher walls
- ✅ Launch pads

#### AI Opponents
- ✅ 5 AI opponents with varied colors
- ✅ Pathfinding navigation towards finish line
- ✅ Realistic failure simulation (they tumble too!)
- ✅ Varied speeds for different difficulty

#### Visuals
- ✅ Vibrant, colorful Fall Guys aesthetic
- ✅ Smooth 3D models with PBR materials
- ✅ Dynamic lighting and soft shadows
- ✅ Themed environments for each level
- ✅ Particle effects (clouds, stars, decorative elements)

#### UI/UX
- ✅ Main menu with Play, Level Select, Customize, Settings
- ✅ Level selection screen
- ✅ In-game HUD (timer, position, checkpoints)
- ✅ Pause menu (Resume, Restart, Quit)
- ✅ Controls information overlay

## 🏗️ Project Structure

```
tumble-guys/
├── index.html              # Main HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.js            # Application entry point
│   ├── game/
│   │   ├── Game.js        # Main game loop and scene management
│   │   ├── Player.js      # Player character with physics
│   │   ├── AIOpponent.js  # AI opponent logic
│   │   ├── Physics.js     # Rapier physics wrapper
│   │   ├── Controls.js    # Input handling
│   │   └── obstacles/
│   │       ├── SpinningPlatform.js
│   │       ├── SwingingHammer.js
│   │       ├── Seesaw.js
│   │       ├── ConveyorBelt.js
│   │       ├── MovingWall.js
│   │       └── LaunchPad.js
│   ├── levels/
│   │   ├── LevelManager.js     # Level management system
│   │   ├── DizzyHeights.js     # Level 1
│   │   ├── SlimeClimb.js       # Level 2
│   │   ├── SeesawMadness.js    # Level 3
│   │   ├── WipeoutZone.js      # Level 4
│   │   └── FinalAscent.js      # Level 5
│   ├── ui/
│   │   └── MainMenu.js    # UI management
│   └── audio/
│       └── AudioManager.js # Audio system (stub)
```

## 🛠️ Technology Stack

- **Three.js** (v0.160.0) - 3D rendering engine
- **Rapier3D** (v0.12.0) - High-performance physics engine
- **Howler.js** (v2.2.4) - Audio management (stub implementation)
- **Vite** (v5.0.0) - Fast build tool and dev server
- **Vanilla JavaScript** - No heavy frameworks

## 🎨 Technical Highlights

### Physics System
- Rapier physics engine for realistic collisions and dynamics
- Kinematic bodies for moving obstacles
- Character capsule colliders for smooth movement
- Momentum-based movement with air control

### Graphics
- PBR materials for realistic surfaces
- Shadow mapping for depth
- Fog effects for atmospheric depth
- Dynamic lighting per level theme
- Smooth 60 FPS performance

### AI System
- Simple but effective pathfinding
- Randomized failure states for comedy
- Varied speeds and behavior

## 🔮 Future Enhancements

Potential additions for future versions:

- [ ] Full audio implementation with Howler.js
- [ ] Character customization system (skins, accessories)
- [ ] Unlockables and progression system
- [ ] Local leaderboards with localStorage
- [ ] More levels and obstacle types
- [ ] Multiplayer support
- [ ] Mobile touch controls
- [ ] Particle effects (confetti, splashes)
- [ ] Win/lose celebration screens
- [ ] Tutorial system

## 📝 License

MIT License - feel free to use this project for learning or as a base for your own games!

## 🙏 Credits

Inspired by Fall Guys: Ultimate Knockout by Mediatonic.

Built with modern web technologies to demonstrate high-quality 3D game development in the browser.

---

Made with ❤️ using Three.js and Rapier Physics