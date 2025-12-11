import Game from './game/Game.js';
import MainMenu from './ui/MainMenu.js';
import AudioManager from './audio/AudioManager.js';

// Initialize the game
let game = null;
let mainMenu = null;
let audioManager = null;

// Show loading screen
const loadingScreen = document.getElementById('loading-screen');

async function init() {
  try {
    // Initialize audio manager
    audioManager = new AudioManager();
    
    // Initialize the game
    game = new Game();
    await game.init();

    // Initialize main menu
    mainMenu = new MainMenu(game, audioManager);
    
    // Store references for global access
    window.game = game;
    window.game.mainMenu = mainMenu;
    game.mainMenu = mainMenu;
    
    // Hide loading screen
    loadingScreen.classList.add('hidden');
    
    // Show main menu
    mainMenu.show();

    console.log('Tumble Guys initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize game:', error);
    loadingScreen.innerHTML = `
      <div style="color: white; text-align: center;">
        <h2>Failed to load game</h2>
        <p>${error.message}</p>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; font-size: 16px;">Retry</button>
      </div>
    `;
  }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle window resize
window.addEventListener('resize', () => {
  if (game) {
    game.onResize();
  }
});
