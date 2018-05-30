import {getData, postData, putData, deleteData } from './api';

const port = process.env.PORT || 9000;
const API_ENDPOINT = `http://localhost:${port}/api`;

const login = (data) => postData(`${API_ENDPOINT}/login`, data);
const register = (data) => postData(`${API_ENDPOINT}/register`, data);
const getDocuments = () => getData(`${API_ENDPOINT}/documents`);
const createDocument = () => postData(`${API_ENDPOINT}/documents`, {name: 'New document', tree: {}});
const getDocument = id => getData(`${API_ENDPOINT}/documents/${id}`);
const saveDocument = (id, data) => putData(`${API_ENDPOINT}/documents/${id}`, data);

export {createDocument, getDocument, saveDocument, getDocuments, login, register};