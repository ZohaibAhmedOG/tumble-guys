import * as THREE from 'three';
import { BaseLevel } from './LevelManager.js';
import SpinningPlatform from '../game/obstacles/SpinningPlatform.js';
import SwingingHammer from '../game/obstacles/SwingingHammer.js';

export default class DizzyHeights extends BaseLevel {
  constructor(scene, physics) {
    super(scene, physics);
    this.name = 'Dizzy Heights';
    this.startPosition = { x: 0, y: 2, z: 0 };
    this.finishPosition = { x: 0, y: 2, z: 80 };
  }

  async build() {
    // Create sky theme
    this.scene.background = new THREE.Color(0x87CEEB);
    this.scene.fog = new THREE.Fog(0x87CEEB, 50, 150);

    // Starting platform
    this.createPlatform({ x: 0, y: 0, z: 0 }, { x: 10, y: 1, z: 10 }, 0x90EE90);

    // First section: straight path with spinning platforms
    this.createPlatform({ x: 0, y: 0, z: 15 }, { x: 8, y: 1, z: 5 }, 0x98D8C8);
    
    // Spinning platforms section
    const spinner1 = new SpinningPlatform(
      this.scene,
      this.physics,
      { x: 0, y: 0, z: 25 },
      { x: 6, y: 1, z: 6 },
      0.5
    );
    this.obstacles.push(spinner1);

    this.createPlatform({ x: 0, y: 0, z: 35 }, { x: 8, y: 1, z: 5 }, 0x98D8C8);

    // Swinging hammers section
    const hammer1 = new SwingingHammer(
      this.scene,
      this.physics,
      { x: -3, y: 3, z: 45 },
      3,
      2
    );
    this.obstacles.push(hammer1);

    const hammer2 = new SwingingHammer(
      this.scene,
      this.physics,
      { x: 3, y: 3, z: 50 },
      3,
      2,
      Math.PI
    );
    this.obstacles.push(hammer2);

    this.createPlatform({ x: 0, y: 0, z: 47.5 }, { x: 10, y: 1, z: 10 }, 0x98D8C8);

    // Second spinning platform
    const spinner2 = new SpinningPlatform(
      this.scene,
      this.physics,
      { x: 0, y: 0, z: 60 },
      { x: 8, y: 1, z: 8 },
      -0.7
    );
    this.obstacles.push(spinner2);

    // Final approach
    this.createPlatform({ x: 0, y: 0, z: 70 }, { x: 8, y: 1, z: 5 }, 0x98D8C8);

    // Finish platform
    this.createPlatform({ x: 0, y: 0, z: 80 }, { x: 12, y: 1, z: 10 }, 0xFFD700);

    // Add some decorative elements
    this.addClouds();
  }

  addClouds() {
    const cloudGeometry = new THREE.SphereGeometry(2, 16, 16);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.9,
      metalness: 0.0,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < 20; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 60,
        10 + Math.random() * 10,
        Math.random() * 100 - 10
      );
      cloud.scale.set(
        1 + Math.random(),
        0.6 + Math.random() * 0.4,
        1 + Math.random()
      );
      this.scene.add(cloud);
      this.objects.push(cloud);
    }
  }
}
