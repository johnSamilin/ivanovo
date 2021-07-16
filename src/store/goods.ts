import create from 'zustand';
import { GOODS } from '../constants';

export const goodsStore = create((set) => ({
    goods: {
        [GOODS.WOOD]: 1,
        [GOODS.APPLES]: 0,
        [GOODS.HONEY]: 0,
    },
    add: (type: GOODS, quantity: number) => set(state => ({
        goods: {
            ...state.goods,
            [type]: (state.goods[type] ?? 0) + quantity,
        }
    }))
}));
