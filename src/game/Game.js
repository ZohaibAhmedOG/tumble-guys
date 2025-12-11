import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import Physics from './Physics.js';
import Player from './Player.js';
import Controls from './Controls.js';
import AIOpponent from './AIOpponent.js';

export default class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.physics = null;
    this.player = null;
    this.aiOpponents = [];
    this.controls = null;
    this.currentLevel = null;
    this.isRunning = false;
    this.isPaused = false;
    this.clock = new THREE.Clock();
    this.gameTime = 0;
    this.raycaster = new THREE.Raycaster();
  }

  async init() {
    // Initialize Rapier physics
    await RAPIER.init();
    this.physics = new Physics(RAPIER);

    // Setup Three.js scene
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();

    // Setup controls
    this.controls = new Controls();

    // Create player
    this.player = new Player(this.scene, this.physics);

    // Start render loop
    this.animate();

    console.log('Game initialized');
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(0, 0, 0);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);

    // Hemisphere light for better ambient
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.4);
    this.scene.add(hemiLight);
  }

  async loadLevel(levelClass) {
    // Clear existing level
    if (this.currentLevel) {
      this.currentLevel.dispose();
    }

    // Clear AI opponents
    this.aiOpponents.forEach(ai => ai.dispose());
    this.aiOpponents = [];

    // Create new level
    this.currentLevel = new levelClass(this.scene, this.physics);
    await this.currentLevel.build();

    // Reset player position
    const startPos = this.currentLevel.getStartPosition();
    this.player.reset(startPos);

    // Create AI opponents
    this.createAIOpponents(5);

    // Reset game time
    this.gameTime = 0;
  }

  createAIOpponents(count) {
    const startPos = this.currentLevel.getStartPosition();
    for (let i = 0; i < count; i++) {
      const ai = new AIOpponent(this.scene, this.physics, i);
      // Spread them out a bit at the start
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        0,
        (Math.random() - 0.5) * 4
      );
      ai.reset({
        x: startPos.x + offset.x,
        y: startPos.y,
        z: startPos.z + offset.z
      });
      this.aiOpponents.push(ai);
    }
  }

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.clock.start();
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
  }

  update(deltaTime) {
    if (!this.isRunning || this.isPaused) return;

    // Update game time
    this.gameTime += deltaTime;

    // Update physics
    this.physics.step(deltaTime);

    // Update player
    if (this.player) {
      this.player.update(deltaTime, this.controls);
    }

    // Update AI opponents
    this.aiOpponents.forEach(ai => {
      ai.update(deltaTime, this.currentLevel);
    });

    // Update current level
    if (this.currentLevel) {
      this.currentLevel.update(deltaTime);
    }

    // Update camera to follow player
    this.updateCamera();

    // Check win condition
    this.checkWinCondition();
  }

  updateCamera() {
    if (!this.player) return;

    const playerPos = this.player.getPosition();
    
    // Camera follows player from behind and above
    const idealOffset = new THREE.Vector3(0, 8, 15);
    const idealLookat = new THREE.Vector3(playerPos.x, playerPos.y + 2, playerPos.z);
    
    const idealPosition = idealLookat.clone().add(idealOffset);
    
    // Smooth camera movement
    this.camera.position.lerp(idealPosition, 0.1);
    this.camera.lookAt(idealLookat);
  }

  checkWinCondition() {
    if (!this.currentLevel || !this.player) return;

    const playerPos = this.player.getPosition();
    const finishLine = this.currentLevel.getFinishPosition();

    if (finishLine) {
      const distance = Math.sqrt(
        Math.pow(playerPos.x - finishLine.x, 2) +
        Math.pow(playerPos.z - finishLine.z, 2)
      );

      if (distance < 5) {
        this.onWin();
      }
    }
  }

  onWin() {
    this.stop();
    console.log('Level completed!', 'Time:', this.gameTime.toFixed(2));
    // TODO: Show win screen
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = Math.min(this.clock.getDelta(), 0.1); // Cap at 100ms

    this.update(deltaTime);
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  getGameTime() {
    return this.gameTime;
  }

  getPlayerPosition() {
    if (!this.player) return 1;
    
    const playerPos = this.player.getPosition();
    const finishLine = this.currentLevel?.getFinishPosition();
    if (!finishLine) return 1;

    const playerDist = Math.sqrt(
      Math.pow(playerPos.x - finishLine.x, 2) +
      Math.pow(playerPos.z - finishLine.z, 2)
    );

    let position = 1;
    this.aiOpponents.forEach(ai => {
      const aiPos = ai.getPosition();
      const aiDist = Math.sqrt(
        Math.pow(aiPos.x - finishLine.x, 2) +
        Math.pow(aiPos.z - finishLine.z, 2)
      );
      if (aiDist < playerDist) {
        position++;
      }
    });

    return position;
  }
}
