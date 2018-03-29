/**
 * Created by bogdan on 29.03.18.
 */
import {v4} from 'uuid';

const addBlock = (blockType) =>({
    type: 'ADD_BLOCK',
    blockType,
    id: v4()
});

export default addBlock;