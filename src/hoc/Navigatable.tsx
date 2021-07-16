import { Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef } from 'react';
import { navigationStore } from '../store/navigation';

export const Navigatable = ({
    id,
    position = new Vector3(0, 0, 0),
    children,
}) => {
    const add = navigationStore(state => state.add);
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
