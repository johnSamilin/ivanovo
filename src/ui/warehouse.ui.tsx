import React from 'react';
import { goodsStore } from '../store/goods';

export const WarehouseUI = () => {
    const goods = goodsStore(state => state.goods);

    return (
        <div>
            <strong>Склад</strong>
            <h4>Товары:</h4>
            {Object.entries(goods).map(([item, quantity]) => (
                <div>
                    {item}: {quantity} шт.
                </div>
            ))}
        </div>
    );
}
