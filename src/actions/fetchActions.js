import * as api from '../api';

const getDocument = dispatch =>
    async id =>
        dispatch({
            type: 'GET_DOCUMENT',
            document: await api.getDocument(id),
        });

const getDocuments = dispatch =>
    async () =>
        dispatch({
            type: 'GET_DOCUMENTS',
            documents: await api.getDocuments(),
        });


export {getDocument, getDocuments};
