import * as THREE from 'three';

export default class AIOpponent {
  constructor(scene, physics, index) {
    this.scene = scene;
    this.physics = physics;
    this.index = index;
    this.mesh = null;
    this.physicsBody = null;
    this.physicsId = null;

    // AI parameters
    this.moveSpeed = 6 + Math.random() * 2; // Varied speed
    this.targetWaypoint = null;
    this.difficulty = 'medium';
    this.failChance = 0.05; // 5% chance to fail per second
    this.isStunned = false;
    this.stunnedTime = 0;

    this.createMesh();
    this.createPhysics();
  }

  createMesh() {
    const group = new THREE.Group();

    // Random color for variety
    const colors = [0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500];
    const color = colors[this.index % colors.length];

    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.4, 0.8, 12, 24);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.3,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Simple eyes
    const eyeGeometry = new THREE.SphereGeometry(0.08, 12, 12);
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.12, 0.5, 0.35);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.12, 0.5, 0.35);
    group.add(rightEye);

    this.mesh = group;
    this.scene.add(this.mesh);
  }

  createPhysics() {
    const startPos = { x: 0, y: 3, z: 0 };
    const result = this.physics.createCapsule(startPos, 0.4, 0.8, false, { type: 'ai' });
    this.physicsBody = result.body;
    this.physicsId = result.id;

    this.physicsBody.setLinearDamping(0.5);
    this.physicsBody.setAngularDamping(0.9);
  }

  update(deltaTime, level) {
    if (!this.physicsBody || !level) return;

    // Update stunned state
    if (this.isStunned) {
      this.stunnedTime -= deltaTime;
      if (this.stunnedTime <= 0) {
        this.isStunned = false;
      }
      this.syncMeshWithPhysics();
      return;
    }

    // Random chance to fail
    if (Math.random() < this.failChance * deltaTime) {
      this.fail();
      this.syncMeshWithPhysics();
      return;
    }

    // Simple AI: move towards finish line
    const currentPos = this.physics.getPosition(this.physicsBody);
    const targetPos = level.getFinishPosition();

    if (targetPos) {
      const dx = targetPos.x - currentPos.x;
      const dz = targetPos.z - currentPos.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance > 1) {
        // Normalize direction
        const dirX = dx / distance;
        const dirZ = dz / distance;

        // Apply movement
        const velocity = this.physics.getLinearVelocity(this.physicsBody);
        this.physics.setLinearVelocity(this.physicsBody, {
          x: dirX * this.moveSpeed,
          y: velocity.y,
          z: dirZ * this.moveSpeed
        });

        // Rotate towards movement direction
        const targetRotation = Math.atan2(dirX, dirZ);
        this.mesh.rotation.y = targetRotation;
      }
    }

    this.syncMeshWithPhysics();
  }

  fail() {
    // AI fails and gets stunned
    this.isStunned = true;
    this.stunnedTime = 1 + Math.random() * 2; // Stunned for 1-3 seconds

    // Apply random impulse to make it tumble
    const impulse = {
      x: (Math.random() - 0.5) * 5,
      y: 3,
      z: (Math.random() - 0.5) * 5
    };
    this.physics.applyImpulse(this.physicsBody, impulse);
  }

  syncMeshWithPhysics() {
    const pos = this.physics.getPosition(this.physicsBody);
    this.mesh.position.set(pos.x, pos.y, pos.z);

    if (!this.isStunned) {
      const rot = this.physics.getRotation(this.physicsBody);
      const euler = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w)
      );
      this.mesh.rotation.y = euler.y;
    } else {
      // When stunned, show full rotation for tumbling effect
      const rot = this.physics.getRotation(this.physicsBody);
      this.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
    }
  }

  reset(position) {
    this.physics.setPosition(this.physicsBody, position);
    this.physics.setLinearVelocity(this.physicsBody, { x: 0, y: 0, z: 0 });
    this.isStunned = false;
    this.stunnedTime = 0;
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
