import { Matrix, Quaternion, Vector3 } from '@babylonjs/core';

const baseVec = new Vector3(0, 0, 0);
const defaultUp = new Vector3(0, 1, 0);

/** получить угол поворота на основании вектора направления */
export function getRotation(targetVector, base = baseVec, up = defaultUp) {
  const vec = new Vector3(targetVector.x, targetVector.y, targetVector.z);
  const rotationMatrix = new Matrix();
  const targetQuaternion = new Quaternion();

  Matrix.LookAtLHToRef(base, vec, up, rotationMatrix);
  targetQuaternion.fromRotationMatrix(rotationMatrix);

  return targetQuaternion;
}
