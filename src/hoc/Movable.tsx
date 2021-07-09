import { Vector3 } from '@babylonjs/core';
import React, { useMemo, useRef } from 'react';
import { useBeforeRender } from 'react-babylonjs';

import { getRotation } from '../helpers/getRotation';

/** перемещает объект в направлении heading со скоростью velocity */
export const Movable = ({
  heading = new Vector3(0, 0, 0),
  velocity = 0,
  position = new Vector3(0, 0, 0),
  onMove = () => { },
  name,
  useQuaternion = true,
  children,
}) => {
  const ref = useRef(null);
  // TODO: Matrix.LookAtLH
  const quaternion = useMemo(() => getRotation(heading), [heading]);

  useBeforeRender(() => {
    if (velocity > 0 && ref.current !== null) {
      ref.current.position.addToRef(heading.normalize().scale(velocity), ref.current.position);
      // onMove(ref.position);
    }
  });

  return (
    <transformNode name={`${name}-movable`} ref={ref} position={position} rotationQuaternion={useQuaternion ? quaternion : undefined}>
      {children}
    </transformNode>
  );
};
