import * as THREE from 'three';

export default class ConveyorBelt {
  constructor(scene, physics, position, size, speed = 2) {
    this.scene = scene;
    this.physics = physics;
    this.position = position;
    this.size = size;
    this.speed = speed; // Positive = forward, negative = backward
    this.mesh = null;
    this.physicsBody = null;
    this.physicsId = null;
    this.textureOffset = 0;

    this.create();
  }

  create() {
    // Create visual mesh with animated texture
    const geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
    
    // Create a simple stripe pattern for the conveyor
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Draw stripes
    ctx.fillStyle = '#666666';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#999999';
    for (let i = 0; i < 256; i += 32) {
      ctx.fillRect(0, i, 256, 16);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(this.size.x / 2, this.size.z / 2);

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.2
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    // Create physics body
    const result = this.physics.createBox(this.position, this.size, true, { 
      type: 'conveyor',
      speed: this.speed 
    });
    this.physicsBody = result.body;
    this.physicsId = result.id;
  }

  update(deltaTime) {
    // Animate texture
    this.textureOffset += this.speed * deltaTime * 0.1;
    if (this.mesh.material.map) {
      this.mesh.material.map.offset.y = this.textureOffset;
    }

    // Note: In a full implementation, we would apply velocity to objects standing on the belt
    // This would require collision detection and callbacks
  }

  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      if (this.mesh.material.map) {
        this.mesh.material.map.dispose();
      }
      this.mesh.material.dispose();
    }
    if (this.physicsId !== null) {
      this.physics.removeBody(this.physicsId);
    }
  }
}
