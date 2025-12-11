import * as THREE from 'three';
import { BaseLevel } from './LevelManager.js';
import ConveyorBelt from '../game/obstacles/ConveyorBelt.js';
import MovingWall from '../game/obstacles/MovingWall.js';

export default class SlimeClimb extends BaseLevel {
  constructor(scene, physics) {
    super(scene, physics);
    this.name = 'Slime Climb';
    this.startPosition = { x: 0, y: 2, z: 0 };
    this.finishPosition = { x: 0, y: 30, z: 60 };
  }

  async build() {
    // Create slime factory theme
    this.scene.background = new THREE.Color(0x88CC88);
    this.scene.fog = new THREE.Fog(0x88CC88, 50, 150);

    // Starting platform
    this.createPlatform({ x: 0, y: 0, z: 0 }, { x: 10, y: 1, z: 10 }, 0x90EE90);

    // First climbing section
    this.createPlatform({ x: 0, y: 2, z: 12 }, { x: 8, y: 1, z: 6 }, 0x88DD88);
    
    // Conveyor belt going against player
    const conveyor1 = new ConveyorBelt(
      this.scene,
      this.physics,
      { x: 0, y: 4, z: 20 },
      { x: 8, y: 1, z: 8 },
      -2
    );
    this.obstacles.push(conveyor1);

    // Moving wall obstacle
    const wall1 = new MovingWall(
      this.scene,
      this.physics,
      { x: -3, y: 7, z: 30 },
      { x: 1, y: 3, z: 8 },
      6,
      2
    );
    this.obstacles.push(wall1);

    this.createPlatform({ x: 0, y: 6, z: 30 }, { x: 10, y: 1, z: 8 }, 0x88DD88);

    // Second conveyor
    const conveyor2 = new ConveyorBelt(
      this.scene,
      this.physics,
      { x: 0, y: 8, z: 40 },
      { x: 8, y: 1, z: 6 },
      -2.5
    );
    this.obstacles.push(conveyor2);

    // More moving walls
    const wall2 = new MovingWall(
      this.scene,
      this.physics,
      { x: 3, y: 12, z: 48 },
      { x: 1, y: 3, z: 6 },
      6,
      2,
      Math.PI
    );
    this.obstacles.push(wall2);

    // High platform sections
    this.createPlatform({ x: 0, y: 10, z: 48 }, { x: 8, y: 1, z: 6 }, 0x88DD88);
    this.createPlatform({ x: -6, y: 15, z: 52 }, { x: 6, y: 1, z: 4 }, 0x77CC77);
    this.createPlatform({ x: 6, y: 20, z: 54 }, { x: 6, y: 1, z: 4 }, 0x77CC77);
    this.createPlatform({ x: 0, y: 25, z: 56 }, { x: 8, y: 1, z: 4 }, 0x88DD88);

    // Final platform
    this.createPlatform({ x: 0, y: 30, z: 60 }, { x: 12, y: 1, z: 10 }, 0xFFD700);

    // Add rising slime effect (visual only)
    this.addSlime();
  }

  addSlime() {
    const slimeGeometry = new THREE.BoxGeometry(50, 0.5, 80);
    const slimeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00FF00,
      transparent: true,
      opacity: 0.6,
      roughness: 0.2,
      metalness: 0.3
    });
    const slime = new THREE.Mesh(slimeGeometry, slimeMaterial);
    slime.position.set(0, -5, 30);
    slime.receiveShadow = true;
    this.scene.add(slime);
    this.objects.push(slime);
  }
}
