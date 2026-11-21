import * as THREE from 'three';

const EYE_HEIGHT = 1.6;
const WALK_SPEED = 4;
const SPRINT_SPEED = 7;
const PLAYER_RADIUS = 0.35;
const PITCH_LIMIT = 1.4;
const HEIGHT_EASE = 10;

export function createController(camera, input, world) {
  const position = new THREE.Vector3(0, 0, 10);
  position.y = world.groundHeight(position.x, position.z) + EYE_HEIGHT;

  let yaw = 0;
  let pitch = 0;
  let paused = false;

  camera.rotation.order = 'YXZ';
  camera.position.copy(position);
  camera.rotation.set(pitch, yaw, 0);

  function resolveCollisions(x, z) {
    const r = PLAYER_RADIUS;
    for (const c of world.colliders) {
      if (c.type === 'box') {
        const minX = c.minX - r;
        const maxX = c.maxX + r;
        const minZ = c.minZ - r;
        const maxZ = c.maxZ + r;
        if (x > minX && x < maxX && z > minZ && z < maxZ) {
          // Push out along the axis with the smallest penetration.
          const toLeft = x - minX;
          const toRight = maxX - x;
          const toBack = z - minZ;
          const toFront = maxZ - z;
          const m = Math.min(toLeft, toRight, toBack, toFront);
          if (m === toLeft) x = minX;
          else if (m === toRight) x = maxX;
          else if (m === toBack) z = minZ;
          else z = maxZ;
        }
      } else if (c.type === 'circle') {
        const dx = x - c.x;
        const dz = z - c.z;
        const minDist = c.r + r;
        const d2 = dx * dx + dz * dz;
        if (d2 < minDist * minDist) {
          const d = Math.sqrt(d2);
          if (d < 1e-6) {
            x = c.x + minDist;
          } else {
            x = c.x + (dx / d) * minDist;
            z = c.z + (dz / d) * minDist;
          }
        }
      }
    }
    return { x, z };
  }

  function update(dt) {
    if (paused) {
      camera.position.copy(position);
      return;
    }

    const look = input.getLook();
    yaw -= look.dx;
    pitch -= look.dy;
    pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch));

    const move = input.getMove();
    const speed = input.isSprinting() ? SPRINT_SPEED : WALK_SPEED;

    // Camera looks along -Z at yaw 0; forward and right on the ground plane.
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    const fwdX = -sin;
    const fwdZ = -cos;
    const rightX = cos;
    const rightZ = -sin;

    const step = speed * dt;
    const moveX = (rightX * move.x + fwdX * move.z) * step;
    const moveZ = (rightZ * move.x + fwdZ * move.z) * step;

    const resolved = resolveCollisions(position.x + moveX, position.z + moveZ);
    position.x = resolved.x;
    position.z = resolved.z;

    const targetY = world.groundHeight(position.x, position.z) + EYE_HEIGHT;
    const k = 1 - Math.exp(-HEIGHT_EASE * dt);
    position.y += (targetY - position.y) * k;

    camera.position.copy(position);
    camera.rotation.set(pitch, yaw, 0);
  }

  function setPaused(value) {
    paused = !!value;
  }

  function isPaused() {
    return paused;
  }

  return { position, update, setPaused, isPaused };
}
