import React, { Component } from "react"
import "../styles/Block.scss"

class Block extends Component {
  componentDidMount() {
    const { col } = this.blockRef.dataset
    this.blockRef.classList.add("block")
    this.blockRef.classList.add(`block--col-${col}`)

    this.subscription = this.props.initDraggable(this.blockRef)
  }

  componentDidUpdate() {
    if (this.blockRef.parentNode && this.blockRef.parentNode.classList.contains("menu__tab-subsection")) return

    const { col } = this.blockRef.dataset
    const prevClass = [...this.blockRef.classList].find(item => item.match(/(block--col-)\w+/g))
    this.blockRef.classList.remove(prevClass)
    this.blockRef.classList.add(`block--col-${col}`)
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    const {
      index,
      data: { blockType, col },
    } = this.props

    return (
      <div
        data-index={index}
        data-col={col}
        data-type={blockType}
        ref={elem => {
          this.blockRef = elem
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

export default Block
