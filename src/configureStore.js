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
        blocks: [
            {
                id: '0',
                type: 'Grid',
                children: [
                    {
                        id: 1,
                        type: 'Regular',
                        flex: 12
                    },
                    {
                        id: 2,
                        type: 'Regular',
                        flex: 12
                    }
                ]
            },
            {
                id: '0',
                type: 'Grid',
                children: [],
            }
        ]
    };
    console.log(persistedState);
    const store = createStore(reducer, persistedState, middleware);

    store.subscribe(throttle(() => {
        saveState({editorState: store.getState().editorState})
    }, 1000));

    return store;
};

export default configureStore;