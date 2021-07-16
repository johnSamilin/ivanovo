import { useMachine } from '@xstate/react';
import React, { useEffect } from 'react';
import { createMachine } from 'xstate';
import { NPC } from './NPC';
import { buildingsStore } from './store/buildings';

const peasantBehavoiur = createMachine({
  id: 'peasant-behaviour',
  initial: 'idle',
  states: {
    idle: {
      on: {
        DELIVER_RESOURCE: {
          target: 'pickingResource',
          actions: 'startServing',
        },
        DELIVER_GOODS: {
          target: 'pickingGoods',
          actions: 'startServing',
        },
      },
    },
    pickingResource: {
      on: { PICKED: 'deliveringResource' },
      invoke: { src: 'pickResource' }
    },
    deliveringResource: {
      on: {
        DELIVERED: {
          target: 'idle',
          actions: 'finishServing',
        }
      },
    },
    pickingGoods: {
      on: { PICKED: 'deliveringGoods' },
      invoke: { src: 'pickGood' }
    },
    deliveringGoods: {
      on: {
        DELIVERED: {
          target: 'idle',
          actions: 'finishServing',
        }
      },
    },
  },
});

const needsServingSelector = (state) => {
  return state.buildings.find(({ resources, servants }) => {
    const resourcesLack = Object.values(resources).reduce((a, e) => a + e, 0);
    return resourcesLack < 0 && Math.abs(resourcesLack) > servants.length;
  });
}

export const Peasant = ({ id, position }) => {
  const needsServing = buildingsStore(needsServingSelector);
  const startServing = buildingsStore(state => state.startServing);
  const finishServing = buildingsStore(state => state.finishServing);

  const [state, send] = useMachine(peasantBehavoiur, {
    services: {
      pickResource: (_, e) => {
        return console.log('pickResource', _, e);
      }
    },
    actions: {
      startServing: (_, e) => {
        console.log('act', e);
        return startServing(id, needsServing.id);
      },
      finishServing: (_, e) => {
        console.log('act');
        return finishServing(id, needsServing.id);
      },
    }
  });

  useEffect(() => {
    console.log('peasant state:', state.value, state);
    if (state.value === 'idle' && needsServing) {
      console.log('Беру задание у', needsServing);
      send({ type: 'DELIVER_RESOURCE', payload: { from: 'a', to: 'b', type: 'c' } })

    }
  }, [state, needsServing]);

  return (
    <NPC
      id={id}
      position={position}
      scale={2}
      model="peasant"
    />
  );
}
