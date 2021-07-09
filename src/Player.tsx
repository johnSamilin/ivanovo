import React from 'react';
import { Vector3 } from '@babylonjs/core';
import '@babylonjs/loaders';
import { Model } from 'react-babylonjs';

import { Movable } from './hoc/Movable';

export function Player({
  position = new Vector3(0, 0, 0),
  heading,
  velocity = 0.5,
}) {

  return (
    <node name="player-wrapper">
      <Movable name="box-1" position={position} velocity={velocity} heading={heading}>
        {/* <box name="box-1" size={50} ref={cameraTarget}>
          <standardMaterial name="box-1-mat" />
        </box> */}
        {/* <Model name="player" rootUrl="./" sceneFilename="models/scene.gltf" /> */}
      </Movable>
    </node>
  );
}
