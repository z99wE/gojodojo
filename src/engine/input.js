export const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const LOOK_SENSITIVITY = 0.0022;
const JOY_RADIUS = 60;
const DEAD_ZONE = 0.15;

export function createInput(domElement) {
  const keys = new Set();
  let interactQueued = false;
  let lookDx = 0;
  let lookDy = 0;

  // Touch state
  let joyId = null;
  let joyOx = 0;
  let joyOy = 0;
  let joyX = 0;
  let joyZ = 0;
  let lookId = null;
  let lookLastX = 0;
  let lookLastY = 0;

  let actionButton = null;

  function onKeyDown(e) {
    if (e.code === 'KeyE') {
      if (!e.repeat) interactQueued = true;
    }
    if (
      e.code === 'Space' ||
      e.code.startsWith('Arrow')
    ) {
      e.preventDefault();
    }
    keys.add(e.code);
  }

  function onKeyUp(e) {
    keys.delete(e.code);
  }

  function onBlur() {
    keys.clear();
  }

  function onMouseMove(e) {
    if (document.pointerLockElement === domElement) {
      lookDx += e.movementX * LOOK_SENSITIVITY;
      lookDy += e.movementY * LOOK_SENSITIVITY;
    }
  }

  function applyDeadZone(x, z) {
    const mag = Math.hypot(x, z);
    if (mag < DEAD_ZONE) return { x: 0, z: 0 };
    const clamped = Math.min(mag, 1);
    return { x: (x / mag) * clamped, z: (z / mag) * clamped };
  }

  function onTouchStart(e) {
    for (const touch of e.changedTouches) {
      const isLeft = touch.clientX < window.innerWidth / 2;
      if (isLeft && joyId === null) {
        joyId = touch.identifier;
        joyOx = touch.clientX;
        joyOy = touch.clientY;
        joyX = 0;
        joyZ = 0;
      } else if (!isLeft && lookId === null) {
        lookId = touch.identifier;
        lookLastX = touch.clientX;
        lookLastY = touch.clientY;
      }
    }
    e.preventDefault();
  }

  function onTouchMove(e) {
    for (const touch of e.changedTouches) {
      if (touch.identifier === joyId) {
        const dx = (touch.clientX - joyOx) / JOY_RADIUS;
        const dy = (touch.clientY - joyOy) / JOY_RADIUS;
        // Screen up (negative dy) is forward (+z).
        const v = applyDeadZone(dx, -dy);
        joyX = v.x;
        joyZ = v.z;
      } else if (touch.identifier === lookId) {
        lookDx += (touch.clientX - lookLastX) * LOOK_SENSITIVITY;
        lookDy += (touch.clientY - lookLastY) * LOOK_SENSITIVITY;
        lookLastX = touch.clientX;
        lookLastY = touch.clientY;
      }
    }
    e.preventDefault();
  }

  function onTouchEnd(e) {
    for (const touch of e.changedTouches) {
      if (touch.identifier === joyId) {
        joyId = null;
        joyX = 0;
        joyZ = 0;
      } else if (touch.identifier === lookId) {
        lookId = null;
      }
    }
    e.preventDefault();
  }

  function onActionTouch(e) {
    interactQueued = true;
    e.preventDefault();
    e.stopPropagation();
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);
  document.addEventListener('mousemove', onMouseMove);

  if (isTouch) {
    domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    domElement.addEventListener('touchend', onTouchEnd, { passive: false });
    domElement.addEventListener('touchcancel', onTouchEnd, { passive: false });

    actionButton = document.createElement('div');
    actionButton.textContent = 'E';
    actionButton.style.cssText = [
      'position:fixed',
      'right:24px',
      'bottom:24px',
      'width:72px',
      'height:72px',
      'border-radius:50%',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'background:rgba(255,255,255,0.35)',
      'border:2px solid rgba(255,255,255,0.8)',
      'color:#fff',
      'font:600 24px sans-serif',
      'user-select:none',
      'touch-action:none',
      'z-index:10',
    ].join(';');
    actionButton.addEventListener('touchstart', onActionTouch, { passive: false });
    document.body.appendChild(actionButton);
  }

  return {
    getMove() {
      let kx = 0;
      let kz = 0;
      if (keys.has('KeyD') || keys.has('ArrowRight')) kx += 1;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) kx -= 1;
      if (keys.has('KeyW') || keys.has('ArrowUp')) kz += 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) kz -= 1;
      if (kx !== 0 && kz !== 0) {
        const inv = Math.SQRT1_2;
        kx *= inv;
        kz *= inv;
      }
      let x = kx + joyX;
      let z = kz + joyZ;
      const mag = Math.hypot(x, z);
      if (mag > 1) {
        x /= mag;
        z /= mag;
      }
      return { x, z };
    },

    isSprinting() {
      return keys.has('ShiftLeft') || keys.has('ShiftRight');
    },

    getLook() {
      const out = { dx: lookDx, dy: lookDy };
      lookDx = 0;
      lookDy = 0;
      return out;
    },

    consumeInteract() {
      const v = interactQueued;
      interactQueued = false;
      return v;
    },

    isTouch,

    dispose() {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mousemove', onMouseMove);
      if (isTouch) {
        domElement.removeEventListener('touchstart', onTouchStart);
        domElement.removeEventListener('touchmove', onTouchMove);
        domElement.removeEventListener('touchend', onTouchEnd);
        domElement.removeEventListener('touchcancel', onTouchEnd);
      }
      if (actionButton) {
        actionButton.removeEventListener('touchstart', onActionTouch);
        actionButton.remove();
        actionButton = null;
      }
      keys.clear();
    },
  };
}
