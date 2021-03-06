import React, { Component } from "react"
import WorkArea from "./WorkArea"
import Menu from "./Menu"
import { create } from "../lib/drag"
import * as resize from "../lib/resize"
import keyHandler from "../lib/keyHandler"
import { connect } from "react-redux"
import { addBlock, deleteBlock, moveBlock, resizeBlock } from "../actions/blockActions"
import { getDocument } from "../actions/fetchActions"
import { redoState, undoState } from "../actions/undoActions"

//style
import "../styles/DragNDrop.scss"
import "../styles/Resize.scss"


class Editor extends Component {
  constructor(props) {
    super(props)

    this.tempState = { draggables: [], enableDragging: true, enableResizing: true }
    const { match: { params } } = props
    props.getDocument(params.id)
    keyHandler(props)
  }

  inWorkArea = (elem, workArea) => {
    const elemRect = elem.getBoundingClientRect()
    const centerH = elemRect.top + window.scrollY + elemRect.height / 2
    const centerW = elemRect.left + window.scrollX + elemRect.width / 2
    const { left, right, top, bottom } = workArea.getBoundingClientRect()

    return left < centerW && right > centerW && (top < centerH && bottom > centerH)
  }

  findDropCandidates = (elem, droppables) => {
    const elemRect = elem.getBoundingClientRect()
    const centerH = elemRect.top + window.scrollY + elemRect.height / 2
    const centerW = elemRect.left + window.scrollX + elemRect.width / 2

    return droppables
      .filter(({ rect: { left, right } }) => left < centerW && right > centerW)
      .filter(({ rect: { top, bottom } }) => top < centerH && bottom > centerH)
      .sort((a, b) => b.level - a.level)
  }

  findNeighbours = (elem, candidates) => {
    const elemRect = elem.getBoundingClientRect()
    const previewMargin = 20
    const getArea = ({ rect: { left, right, width }, index }) => {
      const elemCenter = elemRect.left + elemRect.width / 2
      const center = left + width / 2
      if (left < elemRect.left)
        return {
          area: right - elemRect.left,
          direction: elemCenter > center && index !== 0 ? "after" : "before",
        }

      return { area: elemRect.right - left, direction: elemCenter < center ? "before" : "after" }
    }

    return candidates
      .map((item, index) => ({ node: item, rect: item.getBoundingClientRect(), index }))
      .map(({ node, rect }) => {
        if (node.classList.contains("draggable-preview"))
          return { node, rect: { ...rect, left: rect.left - previewMargin, right: rect.right + previewMargin } }

        return { node, rect }
      })
      .filter(
        ({ rect: { left, right } }) =>
          (left < elemRect.left && right > elemRect.left) || (left < elemRect.right && right > elemRect.right),
      )
      .map(item => ({ ...item, ...getArea(item) }))
      .sort((a, b) => b.area - a.area)
  }

  createPreview = ({ rect: { height, width } }, horizontal = true) => {
    const previewPadding = 20
    let preview = document.createElement("div")
    preview.classList.add("draggable-preview")

    if (horizontal) preview.style.height = height - previewPadding + "px"
    else preview.style.width = width - previewPadding + "px"

    return preview
  }

  calculateColNum = ({ node }, elem) => {
    const totalColNum = 12
    const divisor = node.children.length
    return Math.round(totalColNum / (node === elem.parentNode ? divisor : divisor + 1))
  }

  updatePreview = (oldPreview, dropCandidate, elem, { node, direction }) => {
    let preview = oldPreview

    if (preview) {
      if (preview.node === node) return preview
      preview.node.parentNode.removeChild(preview.node)
    }

    preview = {}
    const previewOffset = 8

    const { workArea } = this.tempState
    const workAreaRect = workArea.getBoundingClientRect()

    if (dropCandidate) {
      preview.node = this.createPreview(dropCandidate)
      preview.parentIndex = dropCandidate.node.dataset.index
      preview.colNum = this.calculateColNum(dropCandidate, elem)

      const parentNode = dropCandidate.node

      switch (direction) {
        case "before": {
          const nodeRect = node.getBoundingClientRect()
          preview.node.style.left = nodeRect.left - previewOffset + "px"
          preview.node.style.top = nodeRect.top + "px"
          preview.nextIndex = node.dataset.index
          // parentNode.insertBefore(preview, node);
          break
        }

        case "after": {
          const nodeRect = node.getBoundingClientRect()
          preview.node.style.left = nodeRect.right - previewOffset + "px"
          preview.node.style.top = nodeRect.top + "px"
          preview.nextIndex = node.nextSibling ? node.nextSibling.dataset.index : null
          // insertAfter(preview, node);
          break
        }

        case "beforeV": {
          const nodeRect = dropCandidate.node.getBoundingClientRect()
          preview.node = this.createPreview({ rect: workAreaRect }, false)
          preview.colNum = 12
          preview.enableGrid = true
          preview.node.style.left = workAreaRect.left + previewOffset + "px"
          preview.node.style.top = nodeRect.top - 2 * previewOffset + "px"
          break
        }

        case "afterV": {
          const nodeRect = dropCandidate.node.getBoundingClientRect()
          preview.node = this.createPreview({ rect: workAreaRect }, false)
          preview.parentIndex = dropCandidate.nextSibling
            ? dropCandidate.nextSibling.dataset.index
            : preview.parentIndex
          preview.colNum = 12
          preview.enableGrid = true
          preview.node.style.left = workAreaRect.left + previewOffset + "px"
          preview.node.style.top = nodeRect.bottom - 2 * previewOffset + "px"
          break
        }

        default: {
          const parentRect = parentNode.getBoundingClientRect()
          preview.node.style.left = parentRect.left - previewOffset + "px"
          if (parentNode.children.length !== 0) {
            const child = [...parentNode.children]
              .slice(-2)
              .reverse()
              .find(child => child !== elem)
            if (child) preview.node.style.left = child.getBoundingClientRect().right - previewOffset + "px"
          }

          preview.node.style.top = parentRect.top + "px"
          preview.nextIndex = null
          // parentNode.appendChild(preview);
          break
        }
      }
    } else {
      preview.node = this.createPreview({ rect: workAreaRect }, false)
      preview.colNum = 12
      preview.parentIndex = "0L"
      preview.enableGrid = true
      preview.node.style.left = workAreaRect.left + previewOffset + "px"

      // TODO refactor
      const childrenLen = workArea.children.length
      if (childrenLen > 0) {
        const lastChildRect = workArea.children[childrenLen - 1].getBoundingClientRect()
        const { bottom } = elem.getBoundingClientRect()
        if (bottom > lastChildRect.bottom) {
          preview.node.style.top = lastChildRect.bottom - 2 * previewOffset + "px"
          preview.parentIndex = childrenLen + "L"
        } else preview.node.style.top = workAreaRect.top + "px"
      } else preview.node.style.top = workAreaRect.top + "px"
    }
    document.body.appendChild(preview.node)
    return preview
  }

  outlineDroppable = (dropCandidate, oldOutlined) => {
    if (oldOutlined) oldOutlined.node.classList.remove("droppable--outlined")
    if (dropCandidate) {
      dropCandidate.node.classList.add("droppable--outlined")
      return dropCandidate
    }

    return oldOutlined
  }

  dragStart = (elem, { clientX, clientY }) => {
    if (elem.parentNode.classList.contains("menu__tab-subsection")) {
      const copy = elem.cloneNode(true)
      elem.parentNode.replaceChild(copy, elem)
      this.initDraggable(copy)
      document.body.appendChild(elem)
    }

    this.tempState.draggableContent = elem.innerText
    elem.innerText = elem.dataset.type

    if (elem.dataset.type === "Text")
      this.tempState.draggableContent = `
      lorem lorem kfs ekw sldk sldk .d ksld ksd.
      skldklorem lorem kfs ekw sldk sldk .d ksld ksd. skldk lorem lorem kfs ekw sldk sldk .d ksld ksd. skldk lorem
      lorem kfs ekw sldk sldk .d ksld ksd. skldk
      `

    if (elem.dataset.type === "Empty") this.tempState.draggableContent = ""

    elem.classList.add("draggable--moved")
    const { height, width } = elem.getBoundingClientRect()
    elem.style.top = `${clientY - height / 2 + window.scrollY}px`
    elem.style.left = `${clientX - width / 2 + window.scrollX}px`
  }

  onDrag = (elem, pos) => {
    let { preview } = this.tempState
    const { workArea, outlinedDroppable } = this.tempState

    const grids = [...document.getElementsByClassName("grid")].map(elem => ({
      node: elem,
      rect: elem.getBoundingClientRect(),
    }))

    const [dropCandidate] = this.findDropCandidates(elem, grids)

    if (dropCandidate) {
      const { top, bottom } = dropCandidate.rect
      const elemRect = elem.getBoundingClientRect()
      const centerH = elemRect.top + window.scrollY + elemRect.height / 2

      if (centerH - top < 16) preview = this.updatePreview(preview, dropCandidate, elem, { direction: "beforeV" })
      else if (bottom - centerH < 16)
        preview = this.updatePreview(preview, dropCandidate, elem, { direction: "afterV" })
      else {
        const [neighbour] = this.findNeighbours(elem, [...dropCandidate.node.children])
        if (neighbour) preview = this.updatePreview(preview, dropCandidate, elem, neighbour)
        else preview = this.updatePreview(preview, dropCandidate, elem, {})
      }
    } else if (this.inWorkArea(elem, workArea)) {
      // top and bottom adding
      preview = this.updatePreview(preview, dropCandidate, elem, {})
    } else if (preview) {
      preview.node.parentNode.removeChild(preview.node)
      preview = null
    }
    this.tempState.preview = preview
    this.tempState.outlinedDroppable = this.outlineDroppable(dropCandidate, outlinedDroppable)
  }

  dragEnd = elem => {
    const { outlinedDroppable } = this.tempState
    if (outlinedDroppable) {
      const translate = /translate.*?\)/g
      outlinedDroppable.node.classList.remove("droppable--outlined")
      elem.style.transform = elem.style.transform.replace(translate, "")
      this.tempState.outlinedDroppable = null
    }
    const { index, type } = elem.dataset

    const { preview } = this.tempState
    if (preview) {
      const { parentIndex, colNum, nextIndex, enableGrid, node } = preview
      const { draggableContent } = this.tempState
      elem.innerText = draggableContent

      if (index) this.props.moveBlock(index, parentIndex, nextIndex, colNum, enableGrid)
      else {
        this.props.addBlock(type, parentIndex, nextIndex, colNum, draggableContent, enableGrid)
        elem.parentNode.removeChild(elem) // TODO  unsubscribe Block from drag
      }
      node.parentNode.removeChild(node)
    } else if (index) this.props.deleteBlock(index)

    this.tempState.preview = null
    elem.style.top = 0
    elem.style.left = 0
    elem.classList.remove("draggable--moved")
  }

  dragPredicate = () => this.tempState.enableDragging

  moveResizeLine = x => {
    const resizeLine = document.querySelector(".resize-line")
    if (resizeLine) resizeLine.style.left = `${x}px`
  }

  resize = (elem, { side, direction, x, index }) => {
    const multiply = side === "left" ? -1 : 1
    const siblingNum = elem.parentNode.children.length - 1

    const elemCol = +elem.dataset.col //getColNum(elem);

    if (elemCol === 12 - siblingNum && direction === multiply) return
    if (elemCol === 1 && direction === -1 * multiply) return

    this.moveResizeLine(x)

    const parentRect = elem.parentNode.getBoundingClientRect()
    const colWidth = parentRect.width / 12
    const prevSiblingColWidth =
      [...elem.parentNode.children].slice(0, index).reduce((acc, item) => acc + +item.dataset.col, 0) * colWidth
    const dif = x - parentRect.left - prevSiblingColWidth - (side === "right" ? elemCol * colWidth : 0)
    const movementColNum = Math.floor(Math.abs(dif) / colWidth)

    if (movementColNum > 0) {
      const getSibling = (elem, side) => (side === "left" ? elem.previousSibling : elem.nextSibling)
      const neighbour = getSibling(elem, side)

      if (neighbour) {
        const neighbourCol = +neighbour.dataset.col //getColNum(neighbour);
        if (neighbourCol === 1 && direction === multiply) return

        const newElemCol = elemCol + movementColNum * direction * multiply
        elem.classList.remove(`block--col-${elemCol}`)
        elem.classList.add(`block--col-${newElemCol}`)
        elem.dataset.col = newElemCol
        elem.dataset.side = side

        const newNeighbourCol = neighbourCol + movementColNum * direction * -1 * multiply
        neighbour.classList.remove(`block--col-${neighbourCol}`)
        neighbour.classList.add(`block--col-${newNeighbourCol}`)
        neighbour.dataset.col = newNeighbourCol
      }
    }
  }

  resizeReady = state => {
    this.tempState.enableDragging = !state
  }

  resizeStart = (elem, pos) => {
    ;[...elem.parentNode.children].forEach(elem => elem.classList.add("droppable--outlined"))
  }

  onResize = (elem, { direction, side, x }) => {
    const { index } = elem.dataset
    const normalIndex = +index.slice(-2)[0]

    if (direction === 0) return
    if (side === "left" && normalIndex === 0) return // if element first and side left
    if (side === "right" && normalIndex === elem.parentNode.children.length - 1) return //// if element last and side right

    this.resize(elem, { direction, side, x, index: normalIndex })
  }

  resizeEnd = elem => {
    ;[...elem.parentNode.children].forEach(elem => elem.classList.remove("droppable--outlined"))

    const resizeLine = document.querySelector(".resize-line")
    if (resizeLine) resizeLine.parentNode.removeChild(resizeLine)

    const { index, side, col } = elem.dataset
    if (side) this.props.resizeBlock(index, col, side)
  }

  resizePredicate = () => this.tempState.enableResizing

  initWorkArea = elem => (this.tempState.workArea = elem)

  initDraggable = elem => {
    if (!elem) return

    elem.classList.add("draggable")

    resize.create(elem, {
      resizeReady: this.resizeReady,
      onResize: this.onResize,
      resizePredicate: this.resizePredicate,
      resizeStart: this.resizeStart,
      resizeEnd: this.resizeEnd,
    })

    return create(elem, {
      onDrag: this.onDrag,
      dragStart: this.dragStart,
      dragEnd: this.dragEnd,
      dragPredicate: this.dragPredicate,
    })
  }

  render() {
    return (
      <div>
        <Menu initDraggable={this.initDraggable}/>
        <WorkArea blocks={this.props.blocks} initWorkArea={this.initWorkArea} initDraggable={this.initDraggable}/>
      </div>
    )
  }
}

export default connect(({ editorState }) => ({ blocks: [...editorState.present.blocks] }), {
  addBlock,
  moveBlock,
  deleteBlock,
  resizeBlock,
  getDocument,
  undoState,
  redoState
})(Editor)
