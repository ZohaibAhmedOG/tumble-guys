import * as THREE from 'three';
import { BaseLevel } from './LevelManager.js';
import Seesaw from '../game/obstacles/Seesaw.js';

export default class SeesawMadness extends BaseLevel {
  constructor(scene, physics) {
    super(scene, physics);
    this.name = 'Seesaw Madness';
    this.startPosition = { x: 0, y: 2, z: 0 };
    this.finishPosition = { x: 0, y: 2, z: 90 };
  }

  async build() {
    // Create playground theme
    this.scene.background = new THREE.Color(0xFFB6C1);
    this.scene.fog = new THREE.Fog(0xFFB6C1, 50, 150);

    // Starting platform
    this.createPlatform({ x: 0, y: 0, z: 0 }, { x: 10, y: 1, z: 10 }, 0xFF6B9D);

    // First section with seesaws
    this.createPlatform({ x: 0, y: 0, z: 12 }, { x: 6, y: 1, z: 4 }, 0xFF85A3);

    const seesaw1 = new Seesaw(this.scene, this.physics, { x: 0, y: 0, z: 20 }, 12, 4);
    this.obstacles.push(seesaw1);

    this.createPlatform({ x: 0, y: 0, z: 28 }, { x: 6, y: 1, z: 4 }, 0xFF85A3);

    // Multiple seesaws in a row
    const seesaw2 = new Seesaw(this.scene, this.physics, { x: -4, y: 0, z: 38 }, 10, 3);
    this.obstacles.push(seesaw2);

    const seesaw3 = new Seesaw(this.scene, this.physics, { x: 4, y: 0, z: 38 }, 10, 3);
    this.obstacles.push(seesaw3);

    this.createPlatform({ x: 0, y: 0, z: 48 }, { x: 8, y: 1, z: 6 }, 0xFF85A3);

    // Long seesaw section
    const seesaw4 = new Seesaw(this.scene, this.physics, { x: 0, y: 0, z: 58 }, 16, 5);
    this.obstacles.push(seesaw4);

    this.createPlatform({ x: 0, y: 0, z: 68 }, { x: 6, y: 1, z: 4 }, 0xFF85A3);

    // Final seesaw gauntlet
    const seesaw5 = new Seesaw(this.scene, this.physics, { x: -3, y: 0, z: 76 }, 8, 3);
    this.obstacles.push(seesaw5);

    const seesaw6 = new Seesaw(this.scene, this.physics, { x: 3, y: 0, z: 80 }, 8, 3);
    this.obstacles.push(seesaw6);

    // Finish platform
    this.createPlatform({ x: 0, y: 0, z: 90 }, { x: 12, y: 1, z: 10 }, 0xFFD700);

    // Add decorative elements
    this.addBouncyBalls();
  }

  addBouncyBalls() {
    const ballGeometry = new THREE.SphereGeometry(1, 16, 16);
    const ballMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF3366,
      roughness: 0.3,
      metalness: 0.2
    });

    for (let i = 0; i < 10; i++) {
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      ball.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 5 + 1,
        Math.random() * 90
      );
      ball.castShadow = true;
      this.scene.add(ball);
      this.objects.push(ball);
    }
  }
}
