import React from "react"
import { NavLink } from "react-router-dom"
import { connect } from "react-redux"
import { getDocuments } from "../actions/fetchActions"
import Navigation from "./Navigation"

import "../styles/Main.scss"
import { compose } from "ramda"
import { getAllDocuments } from "../reducers"
import { lifecycle } from "recompose"

const DocumentItem = ({ name, id }) => (
  <div className={"main__item"}>
    <span className={"main__name"}>{name}</span>
    <NavLink to={`/edit/${id}`}>Edit</NavLink>
  </div>
)

const DocumentList = ({ documents }) => (
  <div className={"main__list"}>{documents.map(({ name, id }) => <DocumentItem name={name} id={id} />)}</div>
)

const Main = ({ documents }) => (
  <div className={"main"}>
    <Navigation />
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
      this.props.getDocuments()
    },
  }),
)

export default enhance(Main)
