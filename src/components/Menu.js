import React from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import BlockList from "./BlockList"
import { redoState, undoState } from "../actions/undoActions"

import "../styles/Menu.scss"

const Menu = ({ initDraggable, undoState, redoState }) => (
  <nav className="menu">
    <div className="menu__tab menu__toggle">
      <NavLink to="/" className="menu__tab-link">
        <i className="material-icons">menu</i>
      </NavLink>
    </div>

    <div className="menu__tab">
      <i className="material-icons">add_box</i>
      <div className="menu__tab-container">
        <div className="menu__tab-content">
          <h1 className="menu__tab-heading">Components</h1>
          <BlockList initDraggable={initDraggable} />
        </div>
      </div>
    </div>

    <div className="menu__tab" onClick={undoState}>
      <i className="material-icons">undo</i>
      <div className="menu__tab-container">
        <div className="menu__tab-content">
          <h1 className="menu__tab-heading">Undo</h1>
        </div>
      </div>
    </div>
    <div className="menu__tab" onClick={redoState}>
      <i className="material-icons">redo</i>
      <div className="menu__tab-container">
        <div className="menu__tab-content">
          <h1 className="menu__tab-heading">Redo</h1>
        </div>
      </div>
    </div>
  </nav>
)

export default connect(null, { undoState, redoState })(Menu)
