import { ActionEvent, Animation, BoundingBox, Material, Mesh, Nullable, PowerEase, Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef, useState } from 'react';
import { useClick, useHover, useScene } from 'react-babylonjs';
import { BUILDINGS, UNITS } from '../constants';
import { uiStore } from '../store/ui';

interface PickableProps {
    id: string;
    type: string;
    subtype: BUILDINGS | UNITS,
    onPick?: () => void;
    bbox?: BoundingBox;
    children: any;
}

const defaultBbox = new BoundingBox(Vector3.Zero(), Vector3.Zero());

export const Pickable = (props: PickableProps) => {
    const { id, type, subtype, onPick = () => { }, bbox = defaultBbox, children } = props;

    const [meshRef, setMeshRef] = useState<Nullable<Mesh>>();
    const [isHovered, setIsHovered] = useState(false);
    const indicatorRef = useRef();
    const select = uiStore(state => state.select);
    const isActive = uiStore(state => state.selectedId === id && state.selectedType === type);

    // выбор
    // selecting
    useClick((e: ActionEvent) => {
        select(id, type, subtype);
    }, { current: meshRef });

    useHover(() => setIsHovered(true), () => setIsHovered(false), { current: meshRef });

    useEffect(() => {
        if (indicatorRef.current && bbox) {
            const from = bbox.maximumWorld.y;
            Animation.CreateAndStartAnimation(
                `${id}-select-animation`,
                indicatorRef.current,
                'position.y',
                60,
                60,
                from + 1,
                from,
                Animation.ANIMATIONLOOPMODE_CYCLE,
                new PowerEase(0.3)
            );

        }
    }, [indicatorRef, bbox]);

    return (<>
        <box
            ref={setMeshRef}
            name={`${id}-t`}
            isPickable
            scaling={bbox.maximumWorld}
        >
            <standardMaterial
                useLogarithmicDepth
                name={`${id}-t-mat`}
                transparencyMode={Material.MATERIAL_ALPHATESTANDBLEND}
                alpha={isHovered || isActive ? 0.1 : 0}
            />
        </box>
        <sphere
            ref={indicatorRef}
            name={`${id}-select-indicator`}
            isVisible={isActive}
        >
            <standardMaterial
                name={`${id}-select-indicator-mat`}
                useLogarithmicDepth
            />
        </sphere>
        {children}
    </>);
}
