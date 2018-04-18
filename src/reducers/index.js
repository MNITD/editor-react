/**
 * Created by bogdan on 29.03.18.
 */
import {combineReducers} from 'redux';
import blocks from './blocksReducer';
import undoReducer from './undoReducer'

const reducer = combineReducers({
    blocks,
    //someOtherReducer
});

export default undoReducer(reducer);