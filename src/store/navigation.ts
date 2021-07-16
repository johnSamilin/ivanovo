import create from 'zustand';

export const navigationStore = create((set) => ({
    units: [],
    add: (id, position, transformNode) => set(state => ({ units: [...state.units, { id, position, transformNode }] })),
}));
