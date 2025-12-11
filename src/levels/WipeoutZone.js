import * as THREE from 'three';
import { BaseLevel } from './LevelManager.js';
import SwingingHammer from '../game/obstacles/SwingingHammer.js';
import SpinningPlatform from '../game/obstacles/SpinningPlatform.js';

export default class WipeoutZone extends BaseLevel {
  constructor(scene, physics) {
    super(scene, physics);
    this.name = 'Wipeout Zone';
    this.startPosition = { x: 0, y: 2, z: 0 };
    this.finishPosition = { x: 0, y: 2, z: 100 };
  }

  async build() {
    // Create beach/water theme
    this.scene.background = new THREE.Color(0x4FC3F7);
    this.scene.fog = new THREE.Fog(0x4FC3F7, 50, 150);

    // Starting platform
    this.createPlatform({ x: 0, y: 0, z: 0 }, { x: 10, y: 1, z: 10 }, 0xF4A460);

    // Hammer gauntlet
    this.createPlatform({ x: 0, y: 0, z: 15 }, { x: 12, y: 1, z: 20 }, 0xE09850);

    for (let i = 0; i < 5; i++) {
      const hammer = new SwingingHammer(
        this.scene,
        this.physics,
        { x: (i % 2 === 0 ? -4 : 4), y: 4, z: 15 + i * 4 },
        3.5,
        1.8,
        i * Math.PI / 3
      );
      this.obstacles.push(hammer);
    }

    // Spinning wheel section
    this.createPlatform({ x: 0, y: 0, z: 40 }, { x: 8, y: 1, z: 6 }, 0xE09850);

    const spinner1 = new SpinningPlatform(
      this.scene,
      this.physics,
      { x: 0, y: 0, z: 50 },
      { x: 10, y: 1, z: 10 },
      1.2
    );
    this.obstacles.push(spinner1);

    this.createPlatform({ x: 0, y: 0, z: 60 }, { x: 8, y: 1, z: 6 }, 0xE09850);

    // More hammers
    for (let i = 0; i < 4; i++) {
      const hammer = new SwingingHammer(
        this.scene,
        this.physics,
        { x: 0, y: 4, z: 68 + i * 5 },
        4,
        2,
        i * Math.PI / 2
      );
      this.obstacles.push(hammer);
    }

    this.createPlatform({ x: 0, y: 0, z: 75 }, { x: 10, y: 1, z: 15 }, 0xE09850);

    // Final spinner before finish
    const spinner2 = new SpinningPlatform(
      this.scene,
      this.physics,
      { x: 0, y: 0, z: 90 },
      { x: 8, y: 1, z: 8 },
      -1.5
    );
    this.obstacles.push(spinner2);

    // Finish platform
    this.createPlatform({ x: 0, y: 0, z: 100 }, { x: 12, y: 1, z: 10 }, 0xFFD700);

    // Add water splash effects
    this.addWater();
  }

  addWater() {
    const waterGeometry = new THREE.PlaneGeometry(60, 120);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0088FF,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      metalness: 0.6
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -2, 50);
    water.receiveShadow = true;
    this.scene.add(water);
    this.objects.push(water);
  }
}
