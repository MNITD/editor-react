import ReactDOM from "react-dom"
import React from "react"

import { Provider } from "react-redux"
import { BrowserRouter as Router } from "react-router-dom"

import configureStore from "./configureStore"
import App from "./components/App"

const store = configureStore()

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById("root"),
)
