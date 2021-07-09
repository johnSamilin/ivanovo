import create from 'zustand';

export const buildingsStore = create((set) => ({
    buildings: [],
    add: (id, position, bbox) => set(state => ({ buildings: [...state.buildings, { id, position, bbox }] })),

}));
