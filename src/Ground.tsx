import React, { memo, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Material, AbstractMesh, ActionEvent, Mesh, Nullable, RecastJSPlugin, Vector3, Color3, PBRMaterial } from '@babylonjs/core';
import '@babylonjs/loaders';
import Recast from 'recast-detour/recast';
import { Model, useSceneLoader, useClick, useScene } from 'react-babylonjs';
import { uiStore } from './store/ui';
import { AGENT_PARAMS, MAX_UNITS_COUNT, NAVMESH_PARAMS, SELECTABLE } from './constants';
import { unitsStore } from './store/units';
import { buildingsStore } from './store/buildings';

window.Recast = Recast;

export const Ground = memo(() => {
    const [ground, setGround] = useState<Nullable<Mesh>>();
    const navigation = useRef(new RecastJSPlugin());
    const agents = useRef(new Map<string, number>());

    const showNavMesh = true; // uiStore(state => state.selectedType === SELECTABLE.UNIT);
    const deselectAll = uiStore(state => state.deselectAll);
    const selectedId = uiStore(state => state.selectedId);
    const units = unitsStore(state => state.units);
    const buildings = buildingsStore(state => state.buildings);

    const scene = useScene();
    const crowd = useMemo(() => {
        if (ground && scene) {
            navigation.current.createNavMesh([ground], NAVMESH_PARAMS);
            // const  navmeshdebug = navigation.current.createDebugNavMesh(scene);
            // navmeshdebug.position = new Vector3(0, 0.01, 0);
            // navmeshdebug.isPickable = false
        
            // var matdebug = new PBRMaterial('matdebug', scene);
            // matdebug.useLogarithmicDepth = true;
            // matdebug.emissiveColor = new Color3(0.1, 0.2, 1);
            // matdebug.alpha = 0.2;
            // navmeshdebug.material = matdebug;
            return navigation.current.createCrowd(MAX_UNITS_COUNT, 2, scene);
        }

    }, [ground, scene]);
    
    // Отряды
    // Units
    useEffect(() => {
        // TODO: difference
        if (crowd) {
            units.forEach((unit) => {
                if (!agents.current.has(unit.id)) {
                    const index = crowd.addAgent(unit.position, AGENT_PARAMS, unit.transformNode);
                    crowd?.agentTeleport(index, unit.position);
                    agents.current.set(unit.id, index);
                }
            });
        }
    }, [units, crowd]);

    // Препятствия
    // Obstacles
    useEffect(() => {
        if (navigation.current.navMesh) {
            buildings.forEach((building) => {                
                navigation.current.addBoxObstacle(
                    building.position,
                    new Vector3(5, 5, 5),
                    0,
                );
            });
        }        
    }, [buildings, crowd]);

    // Перемещение
    // Moving
    useClick((e: ActionEvent) => {        
        if (e.sourceEvent.which === 3) {
            // RMB
            const point = scene?.pick(e.pointerX, e.pointerY);
            const agent = agents.current.get(selectedId);
            const unit = units.find(({ id }) => id === selectedId);
            
            if (unit && !isNaN(agent)) {                
                const finish = navigation.current.getClosestPoint(point?.pickedPoint);
                crowd?.agentGoto(agent, point?.pickedPoint);
            }

        } else {
            deselectAll();
        }

    }, { current: ground });   

    return (
        <>
            <Suspense fallback={null}>
                <plane
                    ref={setGround}
                    name="navmesh-plane"
                    width={500}
                    height={500}
                    rotation={new Vector3(Math.PI / 2, Math.PI, 0)}
                    receiveShadows
                    isPickable
                    isVisible={showNavMesh}
                    position-y={4}
                >
                    <pbrMaterial
                        name="navmesh-mat"
                        useLogarithmicDepth
                        roughness={10}
                        specularIntensity={5}
                        usePhysicalLightFalloff
                    >
                        <texture assignTo="albedoTexture" url={'models/map/satellite_high_details/textures/TerrainNodeMaterial_baseColor.jpeg'} />
                    </pbrMaterial>
                </plane>
                <Model
                    name="ground"
                    rootUrl="./models/map/satellite_high_details/"
                    sceneFilename="scene.gltf"
                    scaleToDimension={500}
                    position-y={-10}
                    onModelLoaded={({ meshes }) => {
                        // setGround(meshes[1])                        
                        meshes?.forEach((mesh: AbstractMesh): void => {
                            if (mesh.material) {
                                // z-fighting workaround
                                mesh.material.useLogarithmicDepth = true;
                                // делаем материал совместимым с обычными источниками света (false)
                                mesh.material.usePhysicalLightFalloff = true;
                            }
                        });
                    }}
                />
            </Suspense>
        </>
    );
});
