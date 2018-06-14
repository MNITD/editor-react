import * as api from "../api"

export const getDocument = id => async dispatch => {
  const document = await api.getDocument(id)
  if (!document.error) dispatch({ type: "GET_DOCUMENT", document })
}

export const getDocuments = () => async dispatch => {
  const documents = await api.getDocuments()
  if (!documents.error) dispatch({ type: "GET_DOCUMENTS", documents })
}
