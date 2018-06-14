import { createStore, applyMiddleware } from "redux"

import thunk from "redux-thunk"

import throttle from "lodash/throttle"
import debounce from "lodash/debounce"

import * as api from "./api"

import reducer from "./reducers"
import { loadState, saveState } from "./utils/localStorage"
import { compose } from "ramda"

const configureStore = () => {
  const persistedState = loadState()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(reducer, persistedState, composeEnhancers(applyMiddleware(thunk)))

  store.subscribe(throttle(() => saveState(store.getState()), 1000))

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
