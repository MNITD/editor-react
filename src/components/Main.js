import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import { connect } from "react-redux"
import { getDocuments } from "../actions/fetchActions"
import Header from "./Header"

import "../styles/Main.scss"
import { compose } from "ramda"
import { getAllDocuments } from "../reducers"
import { lifecycle } from "recompose"

const DocumentList = ({ documents }) => (
  <ul className={"main__list"}>
    {documents.map(({ name, id, link }) => (
      <li key={id} className={"main__item"}>
        <span className={"main__name"}>{name}</span>
        <NavLink to={`/edit/${id}`}>Edit</NavLink>

        {link ? <NavLink to={link}>link</NavLink> : ""}
      </li>
    ))}
  </ul>
)

const Main = ({ documents }) => (
  <div className={"main"}>
    <Header />
    <DocumentList documents={documents} />
  </div>
)

const enhance = compose(
  connect(
    state => ({ documents: getAllDocuments(state) }), //
    { getDocuments },
  ),
  lifecycle({
    componentWillMount() {
      this.props.getDocuments() //TODO: fix it
    },
  }),
)

export default enhance(Main)
