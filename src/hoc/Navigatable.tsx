import { Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef } from 'react';
import { unitsStore } from '../store/units';

export const Navigatable = ({
    id,
    position = new Vector3(0, 0, 0),
    children,
}) => {
    const add = unitsStore(state => state.add);
    const ref = useRef();

    useEffect(() => {
        if (ref) {
            add(id, position, ref.current);
        }
    }, [ref]);

    return (
        <transformNode name={`${id}-navigate-node`} ref={ref}>
            {children}
        </transformNode>
    );
};
