import { createStore, applyMiddleware } from "redux"

import thunk from "redux-thunk"
import debounce from "lodash/debounce"

import * as api from "./api"
import reducer from "./reducers"
import { compose } from "ramda"

const configureStore = () => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

  store.subscribe(
    debounce(() => {
      const { editorState, documents } = store.getState()
      if (documents && documents.current)
        api.updateDocument(documents.current, {
          tree: editorState.present.blocks,
        })
    }, 5000),
  )

  return store
}

export default configureStore
