import { Vector3 } from '@babylonjs/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useScene } from 'react-babylonjs';
import { Movable } from './hoc/Movable';

export const Camera = ({ movementSpeed = 1, screenPadding = 20 }) => {
    const [velocity, setVelocity] = useState(0);
    const [heading, setHeading] = useState(Vector3.Zero());

    const moveCameraIfNeeded = useCallback((e) => {
        let speed = 0, x = 0, z = 0;
        // x-axis    
        if (e.x <= screenPadding) {
            speed = movementSpeed;
            x = -1;
        } else if (e.x >= e.view.innerWidth - screenPadding) {
            speed = movementSpeed;
            x = 1
        }        

        if (e.y <= screenPadding) {
        // y-axis
            speed = movementSpeed;
            z = 1;
        } else if (e.y >= e.view.innerHeight - screenPadding) {
            speed = movementSpeed;
            z = -1;
        }
        
        setHeading(heading.set(x, heading.y, z));
        setVelocity(speed);
    }, []);

    const stopCamera = useCallback(() => {
        setVelocity(0);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', moveCameraIfNeeded);
        window.addEventListener('mouseout', stopCamera);
    }, []);

    return (
        <Movable name="viewer-wrapper" velocity={velocity} heading={heading} useQuaternion={false}>
            <arcRotateCamera
                name="viewer"
                target={Vector3.Zero()}
                alpha={-Math.PI / 2}
                beta={Math.PI / 2 - 0.3}
                radius={100}
                minZ={0.001}
                wheelPrecision={5}
                lowerRadiusLimit={10}
                upperRadiusLimit={100}
                upperBetaLimit={Math.PI / 2}
            />
        </Movable>
    );
}
