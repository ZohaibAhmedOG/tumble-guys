export default class Physics {
  constructor(RAPIER) {
    this.RAPIER = RAPIER;
    this.world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    this.bodies = new Map();
  }

  createBox(position, size, isStatic = false, userData = {}) {
    const rigidBodyDesc = isStatic
      ? this.RAPIER.RigidBodyDesc.fixed()
      : this.RAPIER.RigidBodyDesc.dynamic();
    
    rigidBodyDesc.setTranslation(position.x, position.y, position.z);
    const rigidBody = this.world.createRigidBody(rigidBodyDesc);

    const colliderDesc = this.RAPIER.ColliderDesc.cuboid(
      size.x / 2,
      size.y / 2,
      size.z / 2
    );
    
    if (!isStatic) {
      colliderDesc.setDensity(1.0);
      colliderDesc.setFriction(0.5);
      colliderDesc.setRestitution(0.3);
    } else {
      colliderDesc.setFriction(0.7);
    }

    this.world.createCollider(colliderDesc, rigidBody);

    const id = this.bodies.size;
    this.bodies.set(id, { body: rigidBody, userData });
    return { id, body: rigidBody };
  }

  createCapsule(position, radius, height, isStatic = false, userData = {}) {
    const rigidBodyDesc = isStatic
      ? this.RAPIER.RigidBodyDesc.fixed()
      : this.RAPIER.RigidBodyDesc.dynamic();
    
    rigidBodyDesc.setTranslation(position.x, position.y, position.z);
    
    if (!isStatic) {
      // Lock rotation to prevent character from falling over
      rigidBodyDesc.lockRotations();
      rigidBodyDesc.enabledRotations(false, true, false);
    }
    
    const rigidBody = this.world.createRigidBody(rigidBodyDesc);

    const colliderDesc = this.RAPIER.ColliderDesc.capsule(height / 2, radius);
    
    if (!isStatic) {
      colliderDesc.setDensity(1.0);
      colliderDesc.setFriction(0.5);
      colliderDesc.setRestitution(0.0);
    }

    this.world.createCollider(colliderDesc, rigidBody);

    const id = this.bodies.size;
    this.bodies.set(id, { body: rigidBody, userData });
    return { id, body: rigidBody };
  }

  createSphere(position, radius, isStatic = false, userData = {}) {
    const rigidBodyDesc = isStatic
      ? this.RAPIER.RigidBodyDesc.fixed()
      : this.RAPIER.RigidBodyDesc.dynamic();
    
    rigidBodyDesc.setTranslation(position.x, position.y, position.z);
    const rigidBody = this.world.createRigidBody(rigidBodyDesc);

    const colliderDesc = this.RAPIER.ColliderDesc.ball(radius);
    
    if (!isStatic) {
      colliderDesc.setDensity(1.0);
      colliderDesc.setFriction(0.5);
      colliderDesc.setRestitution(0.5);
    }

    this.world.createCollider(colliderDesc, rigidBody);

    const id = this.bodies.size;
    this.bodies.set(id, { body: rigidBody, userData });
    return { id, body: rigidBody };
  }

  createCylinder(position, radius, height, isStatic = false, userData = {}) {
    const rigidBodyDesc = isStatic
      ? this.RAPIER.RigidBodyDesc.fixed()
      : this.RAPIER.RigidBodyDesc.dynamic();
    
    rigidBodyDesc.setTranslation(position.x, position.y, position.z);
    const rigidBody = this.world.createRigidBody(rigidBodyDesc);

    const colliderDesc = this.RAPIER.ColliderDesc.cylinder(height / 2, radius);
    
    if (!isStatic) {
      colliderDesc.setDensity(1.0);
      colliderDesc.setFriction(0.5);
      colliderDesc.setRestitution(0.3);
    }

    this.world.createCollider(colliderDesc, rigidBody);

    const id = this.bodies.size;
    this.bodies.set(id, { body: rigidBody, userData });
    return { id, body: rigidBody };
  }

  removeBody(id) {
    const bodyData = this.bodies.get(id);
    if (bodyData) {
      this.world.removeRigidBody(bodyData.body);
      this.bodies.delete(id);
    }
  }

  step(deltaTime) {
    // Fixed timestep for physics
    this.world.step();
  }

  applyImpulse(body, impulse) {
    body.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);
  }

  setLinearVelocity(body, velocity) {
    body.setLinvel({ x: velocity.x, y: velocity.y, z: velocity.z }, true);
  }

  getLinearVelocity(body) {
    const vel = body.linvel();
    return { x: vel.x, y: vel.y, z: vel.z };
  }

  getPosition(body) {
    const pos = body.translation();
    return { x: pos.x, y: pos.y, z: pos.z };
  }

  setPosition(body, position) {
    body.setTranslation({ x: position.x, y: position.y, z: position.z }, true);
  }

  getRotation(body) {
    const rot = body.rotation();
    return { x: rot.x, y: rot.y, z: rot.z, w: rot.w };
  }

  setRotation(body, rotation) {
    body.setRotation({ x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }, true);
  }
}
