
const documents = (state={byId:{}, all:[], current:null}, action) =>{

    console.log('action.type', action.type);
    console.log('state', state);

    switch (action.type) {
        case 'GET_DOCUMENTS':{
            return {...state, all: action.documents};
        }
        case 'GET_DOCUMENT':{
            const {document} = action;
            return {...state, byId: {...state.byId, [document.id]: document}, current: document.id};
        }
        default:{
            return state;

        }
    }
};

export default documents;