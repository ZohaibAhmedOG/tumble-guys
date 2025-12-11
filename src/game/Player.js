import * as THREE from 'three';

export default class Player {
  constructor(scene, physics) {
    this.scene = scene;
    this.physics = physics;
    this.mesh = null;
    this.physicsBody = null;
    this.physicsId = null;

    // Movement parameters
    this.moveSpeed = 8;
    this.jumpForce = 8;
    this.airControl = 0.3;
    this.isGrounded = false;
    this.canJump = true;
    this.jumpCooldown = 0;

    this.createMesh();
    this.createPhysics();
  }

  createMesh() {
    // Create a cute bean-like character
    const group = new THREE.Group();

    // Body (main capsule shape made from sphere and cylinder)
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 16, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xff69b4, // Hot pink
      roughness: 0.3,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.0
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.6, 0.4);
    leftEye.castShadow = true;
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.6, 0.4);
    rightEye.castShadow = true;
    group.add(rightEye);

    // Pupils
    const pupilGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const pupilMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.2
    });

    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.15, 0.6, 0.45);
    group.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.15, 0.6, 0.45);
    group.add(rightPupil);

    // Add a cute shine to the character
    const shineGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const shineMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      roughness: 0.0,
      metalness: 0.5
    });
    const shine = new THREE.Mesh(shineGeometry, shineMaterial);
    shine.position.set(0.2, 0.8, 0.3);
    shine.scale.set(1, 1.2, 0.8);
    group.add(shine);

    this.mesh = group;
    this.scene.add(this.mesh);
  }

  createPhysics() {
    const startPos = { x: 0, y: 3, z: 0 };
    const result = this.physics.createCapsule(startPos, 0.5, 1, false, { type: 'player' });
    this.physicsBody = result.body;
    this.physicsId = result.id;

    // Set initial physics properties
    this.physicsBody.setLinearDamping(0.5);
    this.physicsBody.setAngularDamping(0.9);
  }

  update(deltaTime, controls) {
    if (!this.physicsBody) return;

    // Update jump cooldown
    if (this.jumpCooldown > 0) {
      this.jumpCooldown -= deltaTime;
    }

    // Get current velocity
    const velocity = this.physics.getLinearVelocity(this.physicsBody);
    
    // Check if grounded
    this.checkGrounded();

    // Get movement input
    const movement = controls.getMovement();
    
    // Apply movement
    const controlFactor = this.isGrounded ? 1.0 : this.airControl;
    const newVelocity = {
      x: movement.x * this.moveSpeed * controlFactor,
      y: velocity.y,
      z: movement.z * this.moveSpeed * controlFactor
    };

    this.physics.setLinearVelocity(this.physicsBody, newVelocity);

    // Handle jumping
    if (controls.isJumping() && this.canJump && this.isGrounded && this.jumpCooldown <= 0) {
      this.jump();
    }

    // Update mesh position from physics
    this.syncMeshWithPhysics();

    // Rotate mesh based on movement direction
    if (movement.x !== 0 || movement.z !== 0) {
      const targetRotation = Math.atan2(movement.x, movement.z);
      const currentRotation = this.mesh.rotation.y;
      this.mesh.rotation.y = this.lerpAngle(currentRotation, targetRotation, 0.1);
    }

    // Add subtle bouncing animation when moving
    if (this.isGrounded && (movement.x !== 0 || movement.z !== 0)) {
      const bounce = Math.sin(Date.now() * 0.01) * 0.05;
      this.mesh.children[0].position.y = bounce;
    } else {
      this.mesh.children[0].position.y = 0;
    }
  }

  checkGrounded() {
    // Simple ground check - if vertical velocity is small and position is low enough
    const velocity = this.physics.getLinearVelocity(this.physicsBody);
    const pos = this.physics.getPosition(this.physicsBody);
    
    // More sophisticated ground check would use raycasting
    this.isGrounded = Math.abs(velocity.y) < 0.5 && pos.y < 5;
  }

  jump() {
    const impulse = { x: 0, y: this.jumpForce, z: 0 };
    this.physics.applyImpulse(this.physicsBody, impulse);
    this.canJump = false;
    this.jumpCooldown = 0.2; // 200ms cooldown
    
    // Reset jump after a short delay
    setTimeout(() => {
      this.canJump = true;
    }, 100);
  }

  syncMeshWithPhysics() {
    const pos = this.physics.getPosition(this.physicsBody);
    this.mesh.position.set(pos.x, pos.y, pos.z);

    const rot = this.physics.getRotation(this.physicsBody);
    // Only use Y rotation for the mesh to keep character upright
    const euler = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w)
    );
    this.mesh.rotation.y = euler.y;
  }

  lerpAngle(a, b, t) {
    let diff = b - a;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return a + diff * t;
  }

  reset(position) {
    this.physics.setPosition(this.physicsBody, position);
    this.physics.setLinearVelocity(this.physicsBody, { x: 0, y: 0, z: 0 });
    this.syncMeshWithPhysics();
  }

  getPosition() {
    return this.physics.getPosition(this.physicsBody);
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
