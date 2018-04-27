/**
 * Created by bogdan on 29.03.18.
 */
const addBlock = (blockType, parentIndex, nextIndex, col) => ({
    type: 'ADD_BLOCK',
    blockType,
    parentIndex,
    nextIndex,
    col,
});

const moveBlock = (index, parentIndex, nextIndex, col) => ({
    type: 'MOVE_BLOCK',
    index,
    parentIndex,
    nextIndex,
    col,
});

const deleteBlock = (index) => ({
    type: 'DELETE_BLOCK',
    index,
});

export {addBlock, moveBlock, deleteBlock};