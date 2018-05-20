/**
 * Created by bogdan on 29.03.18.
 */

const splitIndex = (index) => index.slice(0, -1).split('L').map(index => +index);

const getNode = (state, path) => {
    // TODO make deep copy with
    let currentNode = state[path[0]];
    if(path.length > 1)
        path.slice(1).forEach((index) => {currentNode  = currentNode.children[index]});
    return currentNode;
    //TODO replace children of currentNode's parent with copy
};

const resizeChildren = (state, parentPath, node,inserting = true) => {
    const parentNode = getNode(state, parentPath);
    if(parentNode.children.length === 0) return;
    const inc = (inserting? (-1) : 1) * (node.col / parentNode.children.length);
    // console.log(' parentNode.children.length',  parentNode.children.length, 'node.col',node.col, 'inc', inc);
    parentNode.children = parentNode.children.map(child => ({...child, col: child.col + inc}));
};

const getSiblingPath = (path, side) =>{
    return [...path.slice(0, -1), path.slice(-1)[0] + (side === 'left'? -1 : 1) ];
};

const resize = (state, nodePath, side, col) => {
    const node = getNode(state, nodePath);
    const dif = col - node.col;

    const siblingPath = getSiblingPath(nodePath, side);
    const siblingNode = getNode(state, siblingPath);
    siblingNode.col -= dif;

    node.col = col;
};

const removeNode = (state, path) => {
    const parentPath = path.slice(0, -1);
    const parentNode = getNode(state, parentPath);
    const node =  parentNode.children.splice(path[path.length - 1], 1)[0];
    resizeChildren(state, parentPath, node, false);

    return node;
};

const addNode = (state, parentPath, nextPath, node) =>{
    resizeChildren(state, parentPath, node);
    const parentNode = getNode(state, parentPath);

    if (nextPath) {
        const startIndex = nextPath[nextPath.length - 1] > 0 ? nextPath[nextPath.length - 1] - 1 : 0;
        parentNode.children.splice(startIndex, 0, node);
    }
    else
        parentNode.children.push(node);
};

const addGrid = (state, parentPath) => {
    const grid = {
        blockType: 'Grid', children: []
    };
    state.splice(parentPath[0], 0, grid);
};

const checkAndRemove = (state, parentPath) => {
    const parentNode = getNode(state, parentPath);
    if (parentNode.children.length === 0) state.splice(parentPath[0], 1);
};

const blocks = (state=[], action) =>{
    console.log(state);
    switch (action.type){
        case 'ADD_BLOCK':{
            const newState = JSON.parse(JSON.stringify(state));///[...state];
            const {blockType,
                parentIndex,
                nextIndex,
                col,
                content,
                enableGrid
            } = action;

            const parentPath = splitIndex(parentIndex);
            const nextPath =  nextIndex? splitIndex(nextIndex) : null;
            const newBlock = {blockType, col, content, children: []};

            if (enableGrid) addGrid(newState, parentPath);

            addNode(newState, parentPath, nextPath, newBlock);

            return newState;
        }
        case 'MOVE_BLOCK':{
            const newState = JSON.parse(JSON.stringify(state)); // [...state];
            const {index,
                parentIndex,
                nextIndex,
                col,
                enableGrid
            } = action;

            const parentPath = splitIndex(parentIndex);
            const nodePath = splitIndex(index);
            const nextPath =  nextIndex? splitIndex(nextIndex) : null;

            const node = removeNode(newState, nodePath);

            if (enableGrid) addGrid(newState, parentPath);

            node.col = col;

            addNode(newState, parentPath, nextPath, node);

            checkAndRemove(newState, nodePath.slice(0, -1));

            return newState;
        }
        case 'DELETE_BLOCK':{
            const newState =  JSON.parse(JSON.stringify(state)); // [...state];
            const {index} = action;
            const nodePath = splitIndex(index);
            removeNode(newState, nodePath);
            checkAndRemove(newState, nodePath.slice(0, -1));
            return newState;
        }
        case 'RESIZE_BLOCK':{
            const newState =  JSON.parse(JSON.stringify(state)); // [...state];
            const {index,
                side,
                col} = action;
            const nodePath = splitIndex(index);
            resize(newState, nodePath, side, col);
            return newState;
        }
        default:
            return state;
    }
};

export default blocks;