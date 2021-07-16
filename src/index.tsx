import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Color3, Mesh, RecastJSPlugin, Vector3 } from '@babylonjs/core';
import { Engine, PointerDragBehavior, Scene, SceneContext, useClick } from 'react-babylonjs';
import ReactDOM from 'react-dom';

import './index.css';
import { Player } from './Player';
import { Building } from './Building';
import { NPC } from './NPC';
import { Ground } from './Ground';
import { HUI } from './ui/HUI';
import { Camera } from './Camera';
import { BUILDINGS } from './constants';
import { Peasant } from './Peasant';


function Game() {
  return (
    <>
      <Engine antialias adaptToDeviceRatio canvasId="root-canvas">
        <Scene>
          <Ground />

          <hemisphericLight
            name="sky"
            direction={Vector3.Up()}
            intensity={2}
            // diffuse={Color3.Red()}
            // specular={Color3.White()}
            // groundColor={Color3.White()}
          />
          {/* <pointLight name="lamp" position={new Vector3(10, 10, -10)} intensity={150}>
          </pointLight> */}
          {/* <pointLight name="lamp2" position={new Vector3(-3, 3, -3)} intensity={50} diffuse={new Color3(0, 0, 1)}>
            <shadowGenerator
              mapSize={1024}
              shadowCasters={[]}
            />
          </pointLight> */}

          <Building
            id='warehouse'
            subtype={BUILDINGS.WAREHOUSE}
            isPlanning
            model='House_01'
            position={new Vector3(-8, 4.1, 4)}
            scale={10}
          />
          <Building
            id='lumber'
            model='House_03'
            position={new Vector3(0, 4.1, 0)}
            scale={5}
          />
          <Building
            id='forrester'
            model='House_02'
            position={new Vector3(6, 4.1, 6)}
            scale={6}
          />
          
          <Peasant id="1" position={new Vector3(6, 4.1, 6)} />
          <Camera />
        </Scene>
      </Engine>
      <HUI />
    </>
  );
}

const mountNode = document.getElementById('root');
ReactDOM.render(<Game />, mountNode);
