const undoState = () => ({
    type: 'UNDO',
});

const redoState = () => ({
    type: 'REDO',
});

export {undoState, redoState}
