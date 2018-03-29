/**
 * Created by bogdan on 29.03.18.
 */
import {combineReducers} from 'redux';

const byId = (state =[], action) =>{
    switch (action.type){
        case 'ADD_BLOCK':
            return [...state, action.id];
        default:
            return state;
    }
};

const blocks = combineReducers({
    byId
});

export default blocks;