import React, { memo, Suspense, useCallback, useState } from 'react';
import { Mesh, BoundingInfo, Nullable, Vector3 } from '@babylonjs/core';
import '@babylonjs/loaders';
import { Model } from 'react-babylonjs';
import { calculateBoundingInfo } from './helpers/calculateBoundingInfo';
import { Pickable } from './hoc/Pickable';
import { SELECTABLES, UNITS } from './constants';
import { Navigatable } from './hoc/Navigatable';

export const NPC = memo(({
    id,
    model,
    isRunning = false,
    position = Vector3.Zero(),
    scale = 1,
    isPickable,
    onPick,
}) => {
    const [bbox, setbbox] = useState<Nullable<BoundingInfo>>();
    const onModelLoaded = useCallback(({ meshes }) => {
        const box = calculateBoundingInfo(meshes)
        meshes[0].setBoundingInfo(bbox);
        setbbox(box);
        meshes?.forEach((mesh: Mesh): void => {
            if (mesh.material) {
                // z-fighting workaround
                mesh.material.useLogarithmicDepth = true;
                // делаем материал совместимым с обычными источниками света (false)
                mesh.material.usePhysicalLightFalloff = true;
            }
        });
    }, [id]);

    return (
        <Suspense fallback={<></>}>
            <Navigatable id={id} position={position}>
                <Pickable
                    id={id}
                    type={SELECTABLES.UNIT}
                    bbox={bbox?.boundingBox}
                    subtype={UNITS.BUILDER}
                    active={isPickable}
                    onPick={onPick}
                >
                    <Model
                        name="player"
                        rootUrl={`./models/units/${model}/`}
                        sceneFilename="scene.gltf"
                        scaleToDimension={scale}
                        onModelLoaded={onModelLoaded}
                        position={new Vector3(0, -1, 0)}
                    />
                </Pickable>
            </Navigatable>
        </Suspense>
    );
});
