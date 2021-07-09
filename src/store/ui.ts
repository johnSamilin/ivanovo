import create from 'zustand';
import { BUILDINGS } from '../constants';

export const uiStore = create(set => ({
    selectedId: null,
    selectedType: null,
    selectedSubtype: null,
    select: (id: string, type: string, subtype: BUILDINGS) => set(state => ({
        ...state,
        selectedId: id,
        selectedType: type,
        selectedSubtype: subtype,
    })),
    deselectAll: () => set(state => ({
        ...state,
        selectedId: null,
        selectedType: null,
        selectedSubtype: null,
    })),
}));
