import * as THREE from 'three';
import { BaseLevel } from './LevelManager.js';
import SpinningPlatform from '../game/obstacles/SpinningPlatform.js';
import SwingingHammer from '../game/obstacles/SwingingHammer.js';
import Seesaw from '../game/obstacles/Seesaw.js';
import MovingWall from '../game/obstacles/MovingWall.js';
import LaunchPad from '../game/obstacles/LaunchPad.js';

export default class FinalAscent extends BaseLevel {
  constructor(scene, physics) {
    super(scene, physics);
    this.name = 'Final Ascent';
    this.startPosition = { x: 0, y: 2, z: 0 };
    this.finishPosition = { x: 0, y: 60, z: 80 };
  }

  async build() {
    // Create neon/space theme
    this.scene.background = new THREE.Color(0x1a1a2e);
    this.scene.fog = new THREE.Fog(0x1a1a2e, 50, 150);

    // Starting platform
    this.createPlatform({ x: 0, y: 0, z: 0 }, { x: 12, y: 1, z: 12 }, 0x9D4EDD);

    // Section 1: Spinning platforms
    const spinner1 = new SpinningPlatform(
      this.scene,
      this.physics,
      { x: 0, y: 3, z: 15 },
      { x: 8, y: 1, z: 8 },
      0.8
    );
    this.obstacles.push(spinner1);

    // Section 2: Launch pad to higher level
    const launch1 = new LaunchPad(
      this.scene,
      this.physics,
      { x: 0, y: 3, z: 25 },
      { x: 6, y: 0.5, z: 6 },
      12
    );
    this.obstacles.push(launch1);

    this.createPlatform({ x: 0, y: 10, z: 32 }, { x: 8, y: 1, z: 6 }, 0x9D4EDD);

    // Section 3: Swinging hammers
    for (let i = 0; i < 3; i++) {
      const hammer = new SwingingHammer(
        this.scene,
        this.physics,
        { x: (i % 2 === 0 ? -3 : 3), y: 14, z: 40 + i * 4 },
        3,
        1.5,
        i * Math.PI / 2
      );
      this.obstacles.push(hammer);
    }

    this.createPlatform({ x: 0, y: 10, z: 45 }, { x: 10, y: 1, z: 8 }, 0x9D4EDD);

    // Section 4: Seesaws going up
    const seesaw1 = new Seesaw(this.scene, this.physics, { x: 0, y: 15, z: 54 }, 10, 4);
    this.obstacles.push(seesaw1);

    this.createPlatform({ x: -8, y: 20, z: 58 }, { x: 6, y: 1, z: 4 }, 0x8B4EDD);

    // Section 5: Moving walls
    const wall1 = new MovingWall(
      this.scene,
      this.physics,
      { x: -8, y: 24, z: 62 },
      { x: 1, y: 3, z: 6 },
      5,
      2
    );
    this.obstacles.push(wall1);

    this.createPlatform({ x: 0, y: 25, z: 64 }, { x: 8, y: 1, z: 6 }, 0x8B4EDD);

    // Section 6: Spinning finale
    const spinner2 = new SpinningPlatform(
      this.scene,
      this.physics,
      { x: 0, y: 30, z: 70 },
      { x: 10, y: 1, z: 10 },
      -1.2
    );
    this.obstacles.push(spinner2);

    // Section 7: Final climb platforms
    this.createPlatform({ x: -6, y: 35, z: 72 }, { x: 4, y: 1, z: 3 }, 0x7B3EDD);
    this.createPlatform({ x: 6, y: 40, z: 74 }, { x: 4, y: 1, z: 3 }, 0x7B3EDD);
    this.createPlatform({ x: -4, y: 45, z: 76 }, { x: 4, y: 1, z: 3 }, 0x7B3EDD);
    this.createPlatform({ x: 4, y: 50, z: 77 }, { x: 4, y: 1, z: 3 }, 0x7B3EDD);
    this.createPlatform({ x: 0, y: 55, z: 78 }, { x: 6, y: 1, z: 4 }, 0x7B3EDD);

    // Victory platform
    this.createPlatform({ x: 0, y: 60, z: 80 }, { x: 14, y: 2, z: 12 }, 0xFFD700);

    // Add stars and space theme
    this.addStars();
    this.addNeonLights();
  }

  addStars() {
    const starGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      emissive: 0xFFFFFF,
      emissiveIntensity: 1
    });

    for (let i = 0; i < 100; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(
        (Math.random() - 0.5) * 100,
        Math.random() * 80,
        (Math.random() - 0.5) * 100
      );
      this.scene.add(star);
      this.objects.push(star);
    }
  }

  addNeonLights() {
    // Add colorful point lights for neon effect
    const colors = [0xFF00FF, 0x00FFFF, 0xFF00AA, 0xAAFF00];
    
    for (let i = 0; i < 8; i++) {
      const light = new THREE.PointLight(colors[i % colors.length], 0.5, 30);
      light.position.set(
        (Math.random() - 0.5) * 30,
        i * 8 + 5,
        i * 10 + 10
      );
      this.scene.add(light);
      this.objects.push(light);
    }
  }
}
