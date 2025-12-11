import * as THREE from 'three';

export default class LaunchPad {
  constructor(scene, physics, position, size, launchForce = 15) {
    this.scene = scene;
    this.physics = physics;
    this.position = position;
    this.size = size;
    this.launchForce = launchForce;
    this.mesh = null;
    this.physicsBody = null;
    this.physicsId = null;
    this.animationPhase = 0;

    this.create();
  }

  create() {
    // Create visual mesh
    const geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00FF88,
      roughness: 0.3,
      metalness: 0.6,
      emissive: 0x00FF88,
      emissiveIntensity: 0.3
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    // Add visual indicator (arrows)
    const arrowGeometry = new THREE.ConeGeometry(0.5, 1, 8);
    const arrowMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      emissive: 0xFFFFFF,
      emissiveIntensity: 0.5
    });
    
    for (let i = 0; i < 3; i++) {
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.rotation.x = -Math.PI / 2;
      arrow.position.set(
        (i - 1) * 2,
        0.5 + i * 0.3,
        0
      );
      this.mesh.add(arrow);
    }

    // Create physics body
    const result = this.physics.createBox(this.position, this.size, true, { 
      type: 'launchpad',
      force: this.launchForce 
    });
    this.physicsBody = result.body;
    this.physicsId = result.id;
  }

  update(deltaTime) {
    // Pulsing animation
    this.animationPhase += deltaTime * 3;
    const pulse = Math.sin(this.animationPhase) * 0.2 + 1;
    this.mesh.material.emissiveIntensity = pulse * 0.3;

    // Bobbing arrows
    this.mesh.children.forEach((arrow, index) => {
      if (arrow.geometry) {
        arrow.position.y = 0.5 + index * 0.3 + Math.sin(this.animationPhase + index) * 0.1;
      }
    });

    // Note: Actual launch functionality would require collision detection
    // In a full implementation, we'd check for characters on the pad and apply impulse
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
