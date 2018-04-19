/**
 * Created by bogdan on 29.03.18.
 */
import {createStore} from 'redux';
import middleware from './middleware';
import throttle from 'lodash/throttle';

import reducer from './reducers'
import {loadState, saveState} from './utils/localStorage';


const configureStore = () => {
    const persistedState = loadState() || {
    // const persistedState = {
        past: [],
        present:{
            blocks: [
            // {
            //     blockType: 'Grid',
            //     children: [
            //         {
            //
            //             blockType: 'Regular',
            //             flex: 12
            //         },
            //         {
            //             blockType: 'Regular',
            //             flex: 12
            //         }
            //     ]
            // },
            {
                blockType: 'Grid',
                children: [],
            },

            {
                blockType: 'Grid',
                children: [],
            },
        ]
        },
        future:[],
    };
    // console.log(persistedState);
    const store = createStore(reducer, persistedState, middleware);

    store.subscribe(throttle(() => {
        saveState(store.getState())
    }, 1000));

    return store;
};

export default configureStore;