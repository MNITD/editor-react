import {getData, postData, putData, deleteData } from './api';

const API_ENDPOINT = 'https://mnitd-editor.herokuapp.com/api';// 'http://localhost:9000/api';
// const API_ENDPOINT = 'http://localhost:9000/api';

const serializeTree = (data) =>  { const tree = JSON.stringify(data.tree); return {...data, tree};};
const deserializeTree = (data) =>  { const tree = JSON.parse(data.tree); return {...data, tree};};

const login = (data) => postData(`${API_ENDPOINT}/login`, data);
const register = (data) => postData(`${API_ENDPOINT}/register`, data);
const getDocuments = () => getData(`${API_ENDPOINT}/documents`);
const createDocument = () => postData(`${API_ENDPOINT}/documents`, serializeTree({name: 'New document', tree: []}));
const getDocument = async (id) => deserializeTree(await getData(`${API_ENDPOINT}/documents/${id}`));
const updateDocument = (id, data) => putData(`${API_ENDPOINT}/documents/${id}`, serializeTree(data));

export {createDocument, getDocument, updateDocument, getDocuments, login, register};