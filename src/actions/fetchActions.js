import * as api from "../api";

const getDocument = dispatch => async id => {
  const document = await api.getDocument(id);
  if (!document.error)
    dispatch({
      type: "GET_DOCUMENT",
      document
    });
};

const getDocuments = dispatch => async () => {
  const documents = await api.getDocuments();
  if (!documents.error)
    dispatch({
      type: "GET_DOCUMENTS",
      documents
    });
};

export { getDocument, getDocuments };
