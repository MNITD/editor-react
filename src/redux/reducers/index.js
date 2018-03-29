/**
 * Created by bogdan on 29.03.18.
 */
import {combineReducers} from 'redux';
import blocks from './blocks.reducer';
// import someOtherReducer from './someOtherReducer'

const editorApp = combineReducers({
    blocks,
    //someOtherReducer
});

export default editorApp;