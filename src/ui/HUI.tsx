import React, { useCallback } from 'react';
import { BUILDINGS } from '../constants';
import { uiStore } from '../store/ui';
import { WarehouseUI } from './warehouse.ui';

export const HUI = () => {
    const { selectedId, selectedType, selectedSubtype } = uiStore(state => ({
        selectedId: state.selectedId,
        selectedType: state.selectedType,
        selectedSubtype: state.selectedSubtype,
    }));

    const renderUI = useCallback(() => {
        switch (selectedSubtype) {
            case BUILDINGS.WAREHOUSE:
                return <WarehouseUI />;
            default:
                return <h4>{selectedType}</h4>;
        }
    }, [selectedSubtype]);

    return (<div className={`hui ${selectedId === null ? 'hidden' : ''}`}>
        {renderUI()}
    </div>);   
}
