/**
 * Created by bogdan on 29.03.18.
 */
import { combineReducers } from "redux";
import blocks from "./blocksReducer";
import undoReducer from "./undoReducer";
import documents, * as fromDocuments from "./documentsReducer";

export default combineReducers({ editorState: undoReducer(blocks), documents });

export const getAllDocuments = state =>
  fromDocuments.getAllDocuments(state.documents);
