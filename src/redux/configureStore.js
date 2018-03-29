/**
 * Created by bogdan on 29.03.18.
 */
import {createStore} from 'redux';
import editorApp from './reducers/index'
import {loadState, saveState} from '../../utils/localStorage';
import throttle from 'lodash/throttle';

const configureStore = () => {
    const persistedState = loadState();
    const store = createStore(editorApp, persistedState);

    store.subscribe(throttle(() => {
        saveState({editorState: store.getState().editorState})
    }, 1000));

    return store;
};

export default configureStore;