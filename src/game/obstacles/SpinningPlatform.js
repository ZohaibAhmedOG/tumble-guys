import * as THREE from 'three';

export default class SpinningPlatform {
  constructor(scene, physics, position, size, rotationSpeed = 1) {
    this.scene = scene;
    this.physics = physics;
    this.position = position;
    this.size = size;
    this.rotationSpeed = rotationSpeed;
    this.mesh = null;
    this.physicsBody = null;
    this.physicsId = null;
    this.rotation = 0;

    this.create();
  }

  create() {
    // Create visual mesh
    const geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
    const material = new THREE.MeshStandardMaterial({
      color: 0xFF6B9D,
      roughness: 0.5,
      metalness: 0.3
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    // Create physics body (kinematic so it moves but isn't affected by collisions)
    const result = this.physics.createBox(this.position, this.size, false, { type: 'obstacle' });
    this.physicsBody = result.body;
    this.physicsId = result.id;

    // Make it kinematic (controlled by script, not physics)
    this.physicsBody.setBodyType(this.physics.RAPIER.RigidBodyType.KinematicPositionBased);
  }

  update(deltaTime) {
    // Update rotation
    this.rotation += this.rotationSpeed * deltaTime;

    // Update mesh rotation
    this.mesh.rotation.y = this.rotation;

    // Update physics body rotation
    const quat = new THREE.Quaternion();
    quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);
    
    this.physics.setRotation(this.physicsBody, {
      x: quat.x,
      y: quat.y,
      z: quat.z,
      w: quat.w
    });

    // Keep position fixed
    this.physics.setPosition(this.physicsBody, this.position);
  }

  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
    if (this.physicsId !== null) {
      this.physics.removeBody(this.physicsId);
    }
  }
}
