export default class Controls {
  constructor() {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false
    };

    this.gamepad = null;
    this.gamepadIndex = -1;

    this.setupKeyboard();
    this.setupGamepad();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });

    window.addEventListener('keyup', (e) => {
      this.handleKeyUp(e);
    });
  }

  handleKeyDown(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = true;
        break;
      case 'Space':
        this.keys.jump = true;
        e.preventDefault();
        break;
    }
  }

  handleKeyUp(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = false;
        break;
      case 'Space':
        this.keys.jump = false;
        break;
    }
  }

  setupGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      console.log('Gamepad connected:', e.gamepad.id);
      this.gamepad = e.gamepad;
      this.gamepadIndex = e.gamepad.index;
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      console.log('Gamepad disconnected');
      if (this.gamepadIndex === e.gamepad.index) {
        this.gamepad = null;
        this.gamepadIndex = -1;
      }
    });
  }

  update() {
    // Update gamepad state
    if (this.gamepadIndex >= 0) {
      const gamepads = navigator.getGamepads();
      this.gamepad = gamepads[this.gamepadIndex];
    }
  }

  getMovement() {
    let x = 0;
    let z = 0;

    // Keyboard input
    if (this.keys.forward) z -= 1;
    if (this.keys.backward) z += 1;
    if (this.keys.left) x -= 1;
    if (this.keys.right) x += 1;

    // Gamepad input (left stick)
    if (this.gamepad) {
      const axes = this.gamepad.axes;
      if (axes.length >= 2) {
        x += axes[0]; // Left stick X
        z += axes[1]; // Left stick Y
      }
    }

    // Normalize diagonal movement
    const length = Math.sqrt(x * x + z * z);
    if (length > 1) {
      x /= length;
      z /= length;
    }

    return { x, z };
  }

  isJumping() {
    let jump = this.keys.jump;

    // Gamepad jump (A button on Xbox, Cross on PlayStation)
    if (this.gamepad && this.gamepad.buttons[0]) {
      jump = jump || this.gamepad.buttons[0].pressed;
    }

    return jump;
  }

  reset() {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false
    };
  }
}
