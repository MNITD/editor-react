/**
 * Created by bogdan on 29.03.18.
 */
const addBlock = (blockType, parentIndex, nextIndex) => ({
    type: 'ADD_BLOCK',
    blockType,
    parentIndex,
    nextIndex,
});

const moveBlock = (index, parentIndex, nextIndex) => ({
    type: 'MOVE_BLOCK',
    index,
    parentIndex,
    nextIndex,
});

const deleteBlock = (index) => ({
    type: 'DELETE_BLOCK',
    index,
});

export {addBlock, moveBlock, deleteBlock};