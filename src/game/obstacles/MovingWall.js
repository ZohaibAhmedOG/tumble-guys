import * as THREE from 'three';

export default class MovingWall {
  constructor(scene, physics, position, size, moveDistance, speed, initialPhase = 0) {
    this.scene = scene;
    this.physics = physics;
    this.startPosition = position;
    this.size = size;
    this.moveDistance = moveDistance;
    this.speed = speed;
    this.phase = initialPhase;
    this.mesh = null;
    this.physicsBody = null;
    this.physicsId = null;

    this.create();
  }

  create() {
    // Create visual mesh (looks like a pusher wall)
    const geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
    const material = new THREE.MeshStandardMaterial({
      color: 0xFF4444,
      roughness: 0.6,
      metalness: 0.3
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    // Add warning stripes
    const stripeGeometry = new THREE.BoxGeometry(this.size.x + 0.1, this.size.y * 0.3, this.size.z + 0.1);
    const stripeMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFF00,
      roughness: 0.6,
      metalness: 0.3
    });
    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    stripe.position.y = -this.size.y * 0.3;
    this.mesh.add(stripe);

    // Create physics body
    const result = this.physics.createBox(this.startPosition, this.size, false, { type: 'obstacle' });
    this.physicsBody = result.body;
    this.physicsId = result.id;

    // Make it kinematic
    this.physicsBody.setBodyType(this.physics.RAPIER.RigidBodyType.KinematicPositionBased);
  }

  update(deltaTime) {
    // Update phase
    this.phase += this.speed * deltaTime;

    // Calculate position along movement axis (moving side to side)
    const offset = Math.sin(this.phase) * this.moveDistance;
    const newX = this.startPosition.x + offset;

    // Update mesh position
    this.mesh.position.x = newX;

    // Update physics position
    this.physics.setPosition(this.physicsBody, {
      x: newX,
      y: this.startPosition.y,
      z: this.startPosition.z
    });
  }

  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
    if (this.physicsId !== null) {
      this.physics.removeBody(this.physicsId);
    }
  }
}
