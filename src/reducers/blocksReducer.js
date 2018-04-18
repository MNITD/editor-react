/**
 * Created by bogdan on 29.03.18.
 */

const splitIndex = (index) => index.slice(0, -1).split('L').map(index => +index);

const getNode = (state, path) => {
    // TODO make deep copy with
    let currentNode = state[path[0]];
    if(path > 1)
        path.slice(1).forEach((index) => {currentNode  = currentNode.children[index]});
    return {...currentNode};
    //TODO replace children of currentNode's parent with copy
};

const removeNode = (state, path) => {
    let parentNode = getNode(state, path.slice(0, -1));
    return parentNode.children.splice(path[path.length - 1], 1)[0];
};

const addNode = (state, parentPath, nextPath, node) =>{
    console.log(parentPath);
    const parentNode = getNode(state, parentPath);
    if(nextPath)
        parentNode.children.splice(nextPath[nextPath.length - 1], 0, node);
    else
        parentNode.children.push(node);
};


const blocks = (state=[], action) =>{
    console.log(state);
    switch (action.type){
        case 'ADD_BLOCK':{
            const newState = [...state];
            const {blockType,
                parentIndex,
                nextIndex} = action;

            const parentPath = splitIndex(parentIndex);
            const nextPath =  nextIndex? splitIndex(nextIndex) : null;
            const newBlock = {blockType, flex: 12, children: []};

            addNode(newState, parentPath, nextPath, newBlock);

            return newState;
        }
        case 'MOVE_BLOCK':{
            const newState = [...state];
            const {index,
                parentIndex,
                nextIndex} = action;
            const parentPath = splitIndex(parentIndex);
            const nodePath = splitIndex(index);
            const nextPath =  nextIndex? splitIndex(nextIndex) : null;
            const node = removeNode(newState, nodePath);

            addNode(newState, parentPath, nextPath, node);

            return newState;
        }
        case 'DELETE_BLOCK':{
            const newState = [...state];
            const {index} = action;
            const nodePath = splitIndex(index);
            removeNode(newState, nodePath);
            return newState;
        }
        default:
            return state;
    }
};

export default blocks;