import React from "react"

import "../styles/Login.scss"
import { register } from "../api"
import { withRouter } from "react-router-dom"
import { compose } from "ramda"
import { withHandlers, withState } from "recompose"

const Register = ({ setLogin, setPassword, handleSubmit }) => (
  <form onSubmit={handleSubmit} className={"login"}>
    <p>Register</p>
    <label className="login__label">
      Login
      <input name="login" type="text" onChange={({ target }) => setLogin(target.value)} />
    </label>

    <label className="login__label">
      Password
      <input name="password" type="password" onChange={({ target }) => setPassword(target.value)} />
    </label>

    <button className="login__btn" type="submit">
      Register
    </button>
  </form>
)

const enhance = compose(
  withRouter,
  withState("login", "setLogin", ""),
  withState("password", "setPassword", ""),
  withHandlers({
    handleSubmit: ({ login, password, history }) => async event => {
      event.preventDefault()

      // TODO save credentials to storage
      const { error, token } = await register({ login, password })
      if (error) return
      localStorage.setItem("token", token)
      history.push("/")
    },
  }),
)

export default enhance(Register)
