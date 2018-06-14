import React, { Component } from "react"
import ReactDOM from "react-dom"
import Block from "./Block"

import "../styles/WorkArea.scss"
import "../styles/Grid.scss"

class WorkArea extends Component {
  componentDidMount() {
    this.props.initWorkArea(ReactDOM.findDOMNode(this))
  }

  render() {
    const { blocks, initDraggable } = this.props
    return (
      <main className="work-area">
        {blocks.map((grid, i) => (
          <div className="grid" key={i} data-index={i + "L"}>
            {grid.children.map((block, j) => (
              <Block key={j} index={`${i}L${j}L`} data={block} initDraggable={initDraggable}>
                {block.content}
              </Block>
            ))}
          </div>
        ))}
      </main>
    )
  }
}

export default WorkArea
