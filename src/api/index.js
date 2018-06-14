import { getData, postData, putData } from "./api"

const API_ENDPOINT = "https://mnitd-editor.herokuapp.com/api"

const serializeTree = data => {
  const tree = JSON.stringify(data.tree)
  return { ...data, tree }
}
const deserializeTree = data => {
  const tree = JSON.parse(data.tree)
  return { ...data, tree }
}

export const login = data => postData(`${API_ENDPOINT}/login`, data)
export const register = data => postData(`${API_ENDPOINT}/register`, data)
export const getDocuments = () => getData(`${API_ENDPOINT}/documents`)
export const createDocument = () =>
  postData(`${API_ENDPOINT}/documents`, serializeTree({ name: "New document", tree: [] }))
export const getDocument = async id => deserializeTree(await getData(`${API_ENDPOINT}/documents/${id}`))
export const updateDocument = (id, data) => putData(`${API_ENDPOINT}/documents/${id}`, serializeTree(data))
