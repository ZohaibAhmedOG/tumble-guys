import * as THREE from 'three';

export default class LevelManager {
  constructor() {
    this.levels = [];
    this.currentLevelIndex = 0;
  }

  registerLevel(levelClass) {
    this.levels.push(levelClass);
  }

  getCurrentLevel() {
    return this.levels[this.currentLevelIndex];
  }

  getNextLevel() {
    this.currentLevelIndex = (this.currentLevelIndex + 1) % this.levels.length;
    return this.getCurrentLevel();
  }

  getLevelByIndex(index) {
    if (index >= 0 && index < this.levels.length) {
      return this.levels[index];
    }
    return null;
  }

  getLevelCount() {
    return this.levels.length;
  }
}

export class BaseLevel {
  constructor(scene, physics) {
    this.scene = scene;
    this.physics = physics;
    this.objects = [];
    this.obstacles = [];
    this.startPosition = { x: 0, y: 5, z: 0 };
    this.finishPosition = { x: 0, y: 1, z: 100 };
  }

  async build() {
    // Override in subclasses
  }

  update(deltaTime) {
    // Update all obstacles
    this.obstacles.forEach(obstacle => {
      if (obstacle.update) {
        obstacle.update(deltaTime);
      }
    });
  }

  createPlatform(position, size, color = 0x90EE90) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    // Create physics body
    this.physics.createBox(position, size, true, { type: 'platform' });

    this.objects.push(mesh);
    return mesh;
  }

  createRamp(position, width, length, height, rotation = 0) {
    const geometry = new THREE.BoxGeometry(width, height, length);
    const material = new THREE.MeshStandardMaterial({
      color: 0xDDA15E,
      roughness: 0.7,
      metalness: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.x = rotation;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    this.objects.push(mesh);
    return mesh;
  }

  getStartPosition() {
    return this.startPosition;
  }

  getFinishPosition() {
    return this.finishPosition;
  }

  dispose() {
    // Remove all objects
    this.objects.forEach(obj => {
      this.scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    // Dispose obstacles
    this.obstacles.forEach(obstacle => {
      if (obstacle.dispose) {
        obstacle.dispose();
      }
    });

    this.objects = [];
    this.obstacles = [];
  }
}
