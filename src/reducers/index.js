/**
 * Created by bogdan on 29.03.18.
 */
import {combineReducers} from 'redux';
import blocks from './blocksReducer';
import undoReducer from './undoReducer';
import documentsReducer from './documentsReducer';

const reducer = combineReducers({
    blocks,
    //someOtherReducer
});

export default combineReducers({editorState: undoReducer(reducer), documents: documentsReducer});