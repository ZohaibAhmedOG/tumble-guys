import * as THREE from 'three';

export default class SwingingHammer {
  constructor(scene, physics, position, length, hammerRadius, initialPhase = 0) {
    this.scene = scene;
    this.physics = physics;
    this.position = position;
    this.length = length;
    this.hammerRadius = hammerRadius;
    this.swingSpeed = 1.5;
    this.swingAngle = Math.PI / 3; // 60 degrees
    this.phase = initialPhase;
    
    this.pivotGroup = null;
    this.hammerMesh = null;
    this.rodMesh = null;
    this.physicsBody = null;
    this.physicsId = null;

    this.create();
  }

  create() {
    // Create pivot group
    this.pivotGroup = new THREE.Group();
    this.pivotGroup.position.set(this.position.x, this.position.y, this.position.z);
    this.scene.add(this.pivotGroup);

    // Create rod
    const rodGeometry = new THREE.CylinderGeometry(0.2, 0.2, this.length);
    const rodMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.7,
      metalness: 0.2
    });
    this.rodMesh = new THREE.Mesh(rodGeometry, rodMaterial);
    this.rodMesh.position.y = -this.length / 2;
    this.rodMesh.castShadow = true;
    this.pivotGroup.add(this.rodMesh);

    // Create hammer head
    const hammerGeometry = new THREE.SphereGeometry(this.hammerRadius, 16, 16);
    const hammerMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF4444,
      roughness: 0.4,
      metalness: 0.4
    });
    this.hammerMesh = new THREE.Mesh(hammerGeometry, hammerMaterial);
    this.hammerMesh.position.y = -this.length;
    this.hammerMesh.castShadow = true;
    this.pivotGroup.add(this.hammerMesh);

    // Create physics body for the hammer
    const hammerWorldPos = new THREE.Vector3();
    this.hammerMesh.getWorldPosition(hammerWorldPos);
    
    const result = this.physics.createSphere(
      { x: hammerWorldPos.x, y: hammerWorldPos.y, z: hammerWorldPos.z },
      this.hammerRadius,
      false,
      { type: 'obstacle' }
    );
    this.physicsBody = result.body;
    this.physicsId = result.id;

    // Make it kinematic
    this.physicsBody.setBodyType(this.physics.RAPIER.RigidBodyType.KinematicPositionBased);
  }

  update(deltaTime) {
    // Update swing phase
    this.phase += this.swingSpeed * deltaTime;

    // Calculate swing angle
    const angle = Math.sin(this.phase) * this.swingAngle;

    // Update pivot rotation
    this.pivotGroup.rotation.z = angle;

    // Update physics body position to match hammer head
    const hammerWorldPos = new THREE.Vector3();
    this.hammerMesh.getWorldPosition(hammerWorldPos);
    
    this.physics.setPosition(this.physicsBody, {
      x: hammerWorldPos.x,
      y: hammerWorldPos.y,
      z: hammerWorldPos.z
    });
  }

  dispose() {
    if (this.pivotGroup) {
      this.scene.remove(this.pivotGroup);
      this.pivotGroup.traverse((child) => {
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
