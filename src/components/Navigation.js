import React from "react"
import { NavLink, withRouter } from "react-router-dom"
import { createDocument } from "../api"

import "../styles/Header.scss"

const Navigation = ({ history }) => (
  <header className={"header"}>
    <button
      onClick={async () => {
        const { id } = await createDocument()
        history.push(`/edit/${id}`)
      }}
    >
      New Document
    </button>
    <NavLink to={"/login"} className={"header__login-btn"}>
      Login
    </NavLink>
    <NavLink to={"/register"} className={"header__login-btn"}>
      Register
    </NavLink>
  </header>
)

export default withRouter(Navigation)
