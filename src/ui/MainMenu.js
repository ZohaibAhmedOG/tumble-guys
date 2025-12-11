import DizzyHeights from '../levels/DizzyHeights.js';
import SlimeClimb from '../levels/SlimeClimb.js';
import SeesawMadness from '../levels/SeesawMadness.js';
import WipeoutZone from '../levels/WipeoutZone.js';
import FinalAscent from '../levels/FinalAscent.js';

export default class MainMenu {
  constructor(game, audioManager) {
    this.game = game;
    this.audioManager = audioManager;
    
    this.menuElement = document.getElementById('main-menu');
    this.hudElement = document.getElementById('hud');
    this.pauseMenuElement = document.getElementById('pause-menu');
    this.controlsElement = document.getElementById('controls-info');
    this.winScreenElement = document.getElementById('win-screen');
    
    this.levels = [
      { name: 'Dizzy Heights', class: DizzyHeights },
      { name: 'Slime Climb', class: SlimeClimb },
      { name: 'Seesaw Madness', class: SeesawMadness },
      { name: 'Wipeout Zone', class: WipeoutZone },
      { name: 'Final Ascent', class: FinalAscent }
    ];
    this.currentLevelIndex = 0;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Play button
    document.getElementById('btn-play').addEventListener('click', () => {
      this.startGame();
    });

    // Level select button
    document.getElementById('btn-levels').addEventListener('click', () => {
      this.showLevelSelect();
    });

    // Customize button
    document.getElementById('btn-customize').addEventListener('click', () => {
      console.log('Customize - Coming soon!');
    });

    // Settings button
    document.getElementById('btn-settings').addEventListener('click', () => {
      console.log('Settings - Coming soon!');
    });

    // Pause menu buttons
    document.getElementById('btn-resume').addEventListener('click', () => {
      this.resumeGame();
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
      this.restartGame();
    });

    document.getElementById('btn-quit').addEventListener('click', () => {
      this.quitToMenu();
    });

    // ESC key for pause
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (this.game.isRunning && !this.game.isPaused) {
          this.pauseGame();
        } else if (this.game.isPaused) {
          this.resumeGame();
        }
      }
    });

    // Win screen buttons
    document.getElementById('btn-next-level').addEventListener('click', () => {
      this.nextLevel();
    });

    document.getElementById('btn-replay').addEventListener('click', () => {
      this.replayLevel();
    });

    document.getElementById('btn-main-menu').addEventListener('click', () => {
      this.winScreenToMenu();
    });
  }

  async startGame(levelIndex = 0) {
    this.currentLevelIndex = levelIndex;
    this.hide();
    this.hudElement.classList.remove('hidden');
    this.controlsElement.classList.remove('hidden');

    // Load selected level
    await this.game.loadLevel(this.levels[levelIndex].class);
    this.game.start();

    // Start HUD update loop
    this.updateHUD();
  }

  showLevelSelect() {
    // Create level select overlay
    let levelSelectDiv = document.getElementById('level-select');
    if (!levelSelectDiv) {
      levelSelectDiv = document.createElement('div');
      levelSelectDiv.id = 'level-select';
      levelSelectDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        color: white;
        z-index: 150;
      `;
      document.getElementById('ui-overlay').appendChild(levelSelectDiv);
    }

    let html = '<h2 style="font-size: 48px; margin-bottom: 30px;">Select Level</h2>';
    this.levels.forEach((level, index) => {
      html += `
        <button class="menu-button" onclick="window.selectLevel(${index})">
          ${index + 1}. ${level.name}
        </button>
      `;
    });
    html += `
      <button class="menu-button" onclick="window.closeLevelSelect()" 
        style="background: linear-gradient(135deg, #666 0%, #999 100%);">
        Back
      </button>
    `;

    levelSelectDiv.innerHTML = html;
    levelSelectDiv.classList.remove('hidden');
  }

  pauseGame() {
    this.game.pause();
    this.pauseMenuElement.classList.remove('hidden');
  }

  resumeGame() {
    this.game.resume();
    this.pauseMenuElement.classList.add('hidden');
  }

  restartGame() {
    this.pauseMenuElement.classList.add('hidden');
    this.game.stop();
    this.startGame();
  }

  quitToMenu() {
    this.game.stop();
    this.pauseMenuElement.classList.add('hidden');
    this.hudElement.classList.add('hidden');
    this.controlsElement.classList.add('hidden');
    this.show();
  }

  showWinScreen() {
    const time = this.game.getGameTime();
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    document.getElementById('win-time').textContent = 
      `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;

    const position = this.game.getPlayerPosition();
    const positionText = position === 1 ? '1st' : 
                        position === 2 ? '2nd' : 
                        position === 3 ? '3rd' : 
                        `${position}th`;
    document.getElementById('win-position').textContent = `Position: ${positionText}`;

    this.winScreenElement.classList.remove('hidden');
    this.hudElement.classList.add('hidden');
  }

  nextLevel() {
    this.winScreenElement.classList.add('hidden');
    const nextIndex = (this.currentLevelIndex + 1) % this.levels.length;
    this.startGame(nextIndex);
  }

  replayLevel() {
    this.winScreenElement.classList.add('hidden');
    this.startGame(this.currentLevelIndex);
  }

  winScreenToMenu() {
    this.winScreenElement.classList.add('hidden');
    this.controlsElement.classList.add('hidden');
    this.game.stop();
    this.show();
  }

  updateHUD() {
    if (!this.game.isRunning) return;

    // Update timer
    const time = this.game.getGameTime();
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    document.getElementById('timer').textContent = 
      `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Update position
    const position = this.game.getPlayerPosition();
    const positionText = position === 1 ? '1st' : 
                        position === 2 ? '2nd' : 
                        position === 3 ? '3rd' : 
                        `${position}th`;
    document.getElementById('position').textContent = positionText;

    // Continue updating
    requestAnimationFrame(() => this.updateHUD());
  }

  show() {
    this.menuElement.classList.remove('hidden');
  }

  hide() {
    this.menuElement.classList.add('hidden');
  }
}

// Global functions for level select (needed for inline onclick handlers)
window.selectLevel = (index) => {
  const levelSelect = document.getElementById('level-select');
  if (levelSelect) {
    levelSelect.classList.add('hidden');
  }
  // Get the menu instance through the game
  if (window.game && window.game.mainMenu) {
    window.game.mainMenu.startGame(index);
  }
};

window.closeLevelSelect = () => {
  const levelSelect = document.getElementById('level-select');
  if (levelSelect) {
    levelSelect.classList.add('hidden');
  }
};
