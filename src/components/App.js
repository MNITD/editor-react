import React from "react"
import Main from "./Main"
import Register from "./Register"
import Editor from "./Editor"
import Login from "./Login"
import { Route, Switch } from "react-router-dom"

const App = () => (
  <Switch>
    <Route path="/" exact={true} component={Main} />

    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/edit/:id" component={Editor} />
  </Switch>
)

export default App
