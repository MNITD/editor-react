/**
 * Created by bogdan on 29.03.18.
 */
const addBlock = (blockType, parentIndex, nextIndex, col, enableGrid = false) => ({
    type: 'ADD_BLOCK',
    blockType,
    parentIndex,
    nextIndex,
    col,
    enableGrid,
});

const moveBlock = (index, parentIndex, nextIndex, col, enableGrid = false) => ({
    type: 'MOVE_BLOCK',
    index,
    parentIndex,
    nextIndex,
    col,
    enableGrid,
});

const deleteBlock = (index) => ({
    type: 'DELETE_BLOCK',
    index,
});

const resizeBlock = (index, col, side) => ({
    type: 'RESIZE_BLOCK',
    index,
    col,
    side,
});

export {addBlock, moveBlock, deleteBlock, resizeBlock};