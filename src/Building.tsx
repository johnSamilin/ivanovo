import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AbstractMesh, ActionEvent, BoundingBox, BoundingInfo, Color3, Material, Mesh, Nullable, Ray, RayHelper, Vector3 } from '@babylonjs/core';
import '@babylonjs/loaders';
import { Model, useClick, useScene } from 'react-babylonjs';
import { Control } from '@babylonjs/gui';
import useInterval from './helpers/useInterval';
import { buildingsStore } from './store/buildings';
import { calculateBoundingInfo } from './helpers/calculateBoundingInfo';
import { uiStore } from './store/ui';
import { SELECTABLE } from './constants';
import { Pickable } from './hoc/Pickable';

export function Building({
    id,
    subtype,
    position: initialPosition = new Vector3(0, 0, 0),
    scale = 1,
    model,
    isPlanning = false,
    isBuilding = false,
}) {
    const labelRef = useRef();
    const meshRef = useRef<Nullable<Mesh>>();
    const [bbox, setBoundingBox] = useState<BoundingInfo>();
    const [yPos, setYPos] = useState(initialPosition.y);
    const [canBeBuilt, setCanBeBuilt] = useState(isPlanning);
    const [buildingProgress, setBuildingProgress] = useState(isBuilding ? 0 : 100);
    const [meshes, setMeshes] = useState<AbstractMesh[]>([]);
    const scene = useScene();

    const info = buildingsStore(state => state.buildings);
    const add = buildingsStore(state => state.add);

    // добавление в реестр
    // registration
    useEffect(() => {
        if (buildingProgress === 100 && bbox) {
            add(id, new Vector3(initialPosition.x, yPos, initialPosition.z), bbox);
        }
    }, [buildingProgress, bbox]);
    useEffect(() => {
        if (labelRef.current && meshRef.current) {
            labelRef.current?.linkWithMesh(meshRef.current);
            meshRef.current.setBoundingInfo(bbox);
        }
    }, [labelRef, meshRef, bbox]);

    // перетаскивание
    // dragging
    function checkIfDragAvailable(point: Vector3): boolean {
        if (point.x > 200 || point.x < -200 || point.z > 200 || point.z < -200) {
            return false;
        }
        const intersects = info
            .filter(({ id: otherId }) => id !== otherId)
            .some((building) => bbox.intersects(building.bbox, false));
            
        setCanBeBuilt(!intersects);

        return true;
    }
    function updateYPosition({ dragPlanePoint }) {
        const ray = new Ray(
            new Vector3(dragPlanePoint.x, dragPlanePoint.y, dragPlanePoint.z),
            Vector3.Down()
        );
        const pickResult = scene?.pickWithRay(ray);
        if (pickResult) {
            setYPos(-pickResult?.distance);
        }
    }

    // процесс постройки
    // building process
    const acceptPosition = useCallback(() => {
        // TODO: кнопка "построить"
        setBuildingProgress(0);
    }, []);

    useInterval(() => {
        setBuildingProgress(buildingProgress + 100 / meshes.length);
    }, meshes.length && isBuilding && buildingProgress < 100 ? 3000 : null);

    useEffect(() => {
        for (let index = 0; index < meshes.length; index++) {
            meshes[index].visibility = index > buildingProgress / meshes.length ? 0 : 1;
        }
    }, [meshes, buildingProgress]);

    return (
        <Suspense fallback={<></>}>
            <transformNode name={`${id}-wrapper`} position={initialPosition}>
                <adtFullscreenUi name='ui1' enableInteractions={isPlanning}>
                    <rectangle
                        ref={labelRef}
                        name={`Build confirm`}
                        background='black'
                        height='30px'
                        alpha={isPlanning ? 0.5 : 0}
                        width='100px'
                        cornerRadius={20}
                        thickness={1}
                        linkOffsetY={30}
                        verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
                        top={0}
                        isVisible={canBeBuilt}
                        zIndex={100}
                        onPointerUpObservable={() => acceptPosition()}
                    >
                        <textBlock name={`${id}-control`} text="Построить" color="white" />
                    </rectangle>
                </adtFullscreenUi>
                <Pickable
                    id={id}
                    type={SELECTABLE.BUILDING}
                    subtype={subtype}
                    bbox={bbox?.boundingBox}
                >
                    <Model
                        name={id}
                        rootUrl="./models/houses/"
                        sceneFilename={`${model}.gltf`}
                        scaleToDimension={scale}
                        // position-y={yPos}
                        onModelLoaded={({ meshes }) => {
                            setMeshes(meshes ?? []);
                            meshRef.current = meshes[0];
                            meshes?.forEach((mesh: AbstractMesh, i): void => {
                                if (mesh.material) {
                                    // z-fighting workaround
                                    mesh.material.useLogarithmicDepth = true;
                                    // делаем материал совместимым с обычными источниками света (false)
                                    mesh.material.usePhysicalLightFalloff = true;
                                }
                            });
                            const bbox = calculateBoundingInfo(meshes);
                            setBoundingBox(bbox);
                        }}
                    >
                    </Model>
                </Pickable>
                <pointerDragBehavior
                    dragPlaneNormal={new Vector3(0, 1, 0)}
                    validateDrag={checkIfDragAvailable}
                    // onDragObservable={updateYPosition}
                    enabled={isPlanning}
                />
            </transformNode>
        </Suspense>
    );
}
