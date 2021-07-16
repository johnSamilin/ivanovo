import create from 'zustand';
import { GOODS } from '../constants';

export const buildingsStore = create((set) => ({
	buildings: [],
	add: (id, position, bbox) => set(state => ({
		buildings: [
			...state.buildings,
			{
				id,
				position,
				bbox,
				resources: {
					[GOODS.WOOD]: -1,
				},
				goods: {},
				servants: [],
			},
		]
	})),
	startServing: (servantId, buildingId) => set(state => state.buildings.map(b => {
		if (b.id === buildingId) {
			b.servants.push(servantId);
		}
		return b;
	})),
	finishServing: (servantId, buildingId) => set(state => state.buildings.map(b => {
		if (b.id === buildingId) {
			b.servants = b.servants.filter(id => id !== servantId);
		}
		return b;
	})),
}));
