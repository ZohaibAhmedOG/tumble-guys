import DizzyHeights from '../levels/DizzyHeights.js';

export default class MainMenu {
  constructor(game, audioManager) {
    this.game = game;
    this.audioManager = audioManager;
    
    this.menuElement = document.getElementById('main-menu');
    this.hudElement = document.getElementById('hud');
    this.pauseMenuElement = document.getElementById('pause-menu');
    this.controlsElement = document.getElementById('controls-info');

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Play button
    document.getElementById('btn-play').addEventListener('click', () => {
      this.startGame();
    });

    // Level select button
    document.getElementById('btn-levels').addEventListener('click', () => {
      console.log('Level select - Coming soon!');
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
  }

  async startGame() {
    this.hide();
    this.hudElement.classList.remove('hidden');
    this.controlsElement.classList.remove('hidden');

    // Load first level
    await this.game.loadLevel(DizzyHeights);
    this.game.start();

    // Start HUD update loop
    this.updateHUD();
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
