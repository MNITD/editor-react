/**
 * Created by bogdan on 29.03.18.
 */
import {createStore, compose} from 'redux';
import middleware from './middleware';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import * as api from './api';


import reducer from './reducers';
import {loadState, saveState} from './utils/localStorage';


const configureStore = () => {
    const persistedState = loadState() || {
        // const persistedState = {
        editorState: {
            past: [],
            present: {
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
                    // {
                    //     blockType: 'Grid',
                    //     children: [],
                    // },
                    //
                    // {
                    //     blockType: 'Grid',
                    //     children: [],
                    // },
                ],
            },
            future: [],
        },
    };
    // console.log(persistedState);
    const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(reducer, persistedState, composeEnhancers());

    store.subscribe(throttle(() => {
        // console.log('saveState');
        saveState(store.getState());
    }, 1000));

    store.subscribe(debounce(() => {
        const {editorState, documents} = store.getState();
        // console.log('updateDocument', editorState.present.blocks);
        if(documents && documents.current)
        if(documents.current) api.updateDocument(documents.current, {tree:editorState.present.blocks});
    }, 5000));

    return store;
};

export default configureStore;