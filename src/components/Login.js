import React from "react"

import "../styles/Login.scss"
import { login as logIn } from "../api"
import { withRouter } from "react-router-dom"

class Login extends React.Component {
  handleSubmit(event) {
    event.preventDefault()
    const { login, password } = this.state
    const { history } = this.props

    logIn({ login, password }).then(({ error, token }) => {
      if (error) {
        console.log(error)
        return
      }
      localStorage.setItem("token", token)
      history.push("/")
    }) // TODO save credentials to storage
  }

  handleChange(
    property,
    {
      target: { value },
    },
  ) {
    console.log(property, value)
    this.setState({ [property]: value })
  }

  render() {
    return (
      <div className={"login"}>
        <form onSubmit={::this.handleSubmit}>
          <p>Login</p>
          <label className="login__label" htmlFor="login">
            Login
          </label>
          <input id="login" name="login" type="text" onChange={this.handleChange.bind(this, "login")} />
          <label className="login__label" htmlFor="password">
            Password
          </label>
          <input id="password" name="password" type="password" onChange={this.handleChange.bind(this, "password")} />

          <button className="login__btn" type="submit">
            Log in
          </button>
        </form>
      </div>
    )
  }
}

export default withRouter(Login)
