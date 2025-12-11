import * as THREE from 'three';

export default class Seesaw {
  constructor(scene, physics, position, length, width) {
    this.scene = scene;
    this.physics = physics;
    this.position = position;
    this.length = length;
    this.width = width;
    this.mesh = null;
    this.pivotMesh = null;
    this.physicsBody = null;
    this.physicsId = null;

    this.create();
  }

  create() {
    // Create pivot/fulcrum
    const pivotGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1);
    const pivotMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 0.6,
      metalness: 0.5
    });
    this.pivotMesh = new THREE.Mesh(pivotGeometry, pivotMaterial);
    this.pivotMesh.position.set(this.position.x, this.position.y, this.position.z);
    this.pivotMesh.castShadow = true;
    this.pivotMesh.receiveShadow = true;
    this.scene.add(this.pivotMesh);

    // Create seesaw plank
    const plankGeometry = new THREE.BoxGeometry(this.width, 0.5, this.length);
    const plankMaterial = new THREE.MeshStandardMaterial({
      color: 0xDDA15E,
      roughness: 0.7,
      metalness: 0.1
    });
    this.mesh = new THREE.Mesh(plankGeometry, plankMaterial);
    this.mesh.position.set(this.position.x, this.position.y + 0.75, this.position.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    // Create physics body with rotation enabled around X axis
    const result = this.physics.createBox(
      { x: this.position.x, y: this.position.y + 0.75, z: this.position.z },
      { x: this.width, y: 0.5, z: this.length },
      false,
      { type: 'seesaw' }
    );
    this.physicsBody = result.body;
    this.physicsId = result.id;

    // Enable rotation only around Z axis (for seesaw tilting)
    this.physicsBody.lockRotations(false);
    this.physicsBody.setEnabledRotations(true, false, true, true);
    
    // Reduce damping for more responsive tilting
    this.physicsBody.setLinearDamping(0.8);
    this.physicsBody.setAngularDamping(0.5);
  }

  update(deltaTime) {
    // Sync mesh with physics
    const pos = this.physics.getPosition(this.physicsBody);
    const rot = this.physics.getRotation(this.physicsBody);

    this.mesh.position.set(pos.x, pos.y, pos.z);
    this.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);

    // Apply a slight restoring force to keep it balanced
    const currentRot = this.mesh.rotation.z;
    if (Math.abs(currentRot) < 0.5) {
      const restoreForce = -currentRot * 0.5;
      this.physicsBody.applyTorqueImpulse({ x: 0, y: 0, z: restoreForce }, true);
    }
  }

  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
    if (this.pivotMesh) {
      this.scene.remove(this.pivotMesh);
      this.pivotMesh.geometry.dispose();
      this.pivotMesh.material.dispose();
    }
    if (this.physicsId !== null) {
      this.physics.removeBody(this.physicsId);
    }
  }
}
