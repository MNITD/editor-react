/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import WorkArea from './WorkArea';
import Menu from '../components/Menu';
import {create} from '../lib/drag';
import * as resize from '../lib/resize';
import {connect} from 'react-redux';
import {addBlock, moveBlock, deleteBlock, resizeBlock} from '../actions/blockActions';

//style
import '../styles/main.scss';
import '../styles/drag_n_drop.scss';
import '../styles/resize.scss';

class App extends Component {
    constructor(props) {
        super(props);

        this.tempState = {draggables: [], grids: [], enableDragging: true, enableResizing: true};
    }

    findDropCandidates(elem, droppables) {
        const elemRect = elem.getBoundingClientRect();
        const centerH = elemRect.top + window.scrollY + elemRect.height / 2;
        const centerW = elemRect.left + window.scrollX + elemRect.width / 2;

        return droppables
            .filter(({rect: {left, right}}) => (left < centerW && right > centerW))
            .filter(({rect: {top, bottom}}) => (top < centerH && bottom > centerH))
            .sort((a, b) => b.level - a.level);
    };

    findNeighbours(elem, candidates) {
        const elemRect = elem.getBoundingClientRect();
        const previewMargin = 20;
        const getArea = ({rect: {left, right, width}, index}) => {
            const elemCenter = elemRect.left + elemRect.width / 2;
            const center = left + width / 2;
            if (left < elemRect.left)
                return {area: right - elemRect.left, direction: elemCenter > center ? 'after' : 'before'};

            return {area: elemRect.right - left, direction: elemCenter < center ? 'before' : 'after'}
        };
        return candidates
            .map((item, index) => ({node: item, rect: item.getBoundingClientRect(), index}))
            .map(({node, rect}) => {
                if (node.classList.contains('draggable-preview'))
                    return {node, rect: {...rect, left: rect.left - previewMargin, right: rect.right + previewMargin}};

                return {node, rect};
            })
            .filter(({rect: {left, right}}) => (
                (left < elemRect.left && right > elemRect.left) || (left < elemRect.right && right > elemRect.right))
            )
            .map((item) => ({...item, ...getArea(item)}))
            .sort((a, b) => b.area - a.area);
    };

    createPreview({rect: {height}, node}, elem) {
        const previewPadding = 20;
        let preview = document.createElement('div');
        preview.classList.add('draggable-preview');

        // preview.classList.add(`block--col-${colNum}`);
        preview.style.height = height - previewPadding + 'px';
        return preview;
    }

    calulateColNum({node}, elem) {
        const totalColNum = 12;
        const divisor = node.children.length;
        return Math.round(totalColNum / (node === elem.parentNode ? divisor : divisor + 1));
    }

    updatePreview(oldPreview, dropCandidate, elem, {node, direction}) {
        let preview = oldPreview;
        if (dropCandidate) {
            if (preview) {
                if (preview.node === node) return preview;
                preview.node.parentNode.removeChild(preview.node);
            }
            preview = {};
            preview.node = this.createPreview(dropCandidate, elem);
            preview.parentIndex = dropCandidate.node.dataset.index;
            preview.colNum = this.calulateColNum(dropCandidate, elem);

            const parentNode = dropCandidate.node;
            const previewOffset = 8;

            switch (direction) {
                case 'before': {
                    const nodeRect = node.getBoundingClientRect();
                    preview.node.style.left = nodeRect.left - previewOffset + 'px';
                    preview.node.style.top = nodeRect.top + 'px';
                    preview.nextIndex = node.dataset.index;
                    // parentNode.insertBefore(preview, node);
                    break;
                }
                case 'after':
                    const nodeRect = node.getBoundingClientRect();
                    preview.node.style.left = nodeRect.right - previewOffset + 'px';
                    preview.node.style.top = nodeRect.top + 'px';
                    preview.nextIndex = node.nextSibling ? node.nextSibling.dataset.index : null;
                    // insertAfter(preview, node);
                    break;
                default: {
                    const parentRect = parentNode.getBoundingClientRect();
                    preview.node.style.left = parentRect.left - previewOffset + 'px';
                    if (parentNode.children.length !== 0) {
                        const child = [...parentNode.children]
                            .slice(-2)
                            .reverse()
                            .find(
                                (child) => child !== elem
                            );
                        if (child) preview.node.style.left = child.getBoundingClientRect().right - previewOffset + 'px';
                    }

                    preview.node.style.top = parentRect.top + 'px';
                    preview.nextIndex = null;
                    // parentNode.appendChild(preview);
                    break;
                }

            }
            document.body.appendChild(preview.node);
        }
        return preview;
    };

    outlineDroppable(dropCandidate, oldOutlined) {
        let outlined = oldOutlined;
        if (dropCandidate) {
            if (outlined) outlined.node.classList.remove('droppable--outlined');
            dropCandidate.node.classList.add('droppable--outlined');
            outlined = dropCandidate;
        }

        return outlined;
    }

    dragStart(elem, {clientX, clientY}) {
        console.log(elem.parentNode.children.length);
        if (elem.parentNode.classList.contains('menu__tab-subsection')) {
            const copy = elem.cloneNode(true);
            elem.parentNode.replaceChild(copy, elem);
            // console.log('copy', copy);
            this.initDraggable(copy);
            document.body.appendChild(elem);
        }

        elem.classList.add('draggable--moved');
        const {height, width} = elem.getBoundingClientRect();
        elem.style.top = `${clientY - height / 2 + window.scrollY}px`;
        elem.style.left = `${clientX - width / 2 + window.scrollX}px`;
    }

    onDrag(elem, pos) {
        let {preview} = this.tempState;
        const {grids, outlinedDroppable} = this.tempState;
        const [dropCandidate] = this.findDropCandidates(elem, grids);

        if (dropCandidate) {
            const [neighbour] = this.findNeighbours(elem, [...dropCandidate.node.children]);
            if (neighbour)
                preview = this.updatePreview(preview, dropCandidate, elem, neighbour);
            else
                preview = this.updatePreview(preview, dropCandidate, elem, {});

        } else if (preview) {
            preview.node.parentNode.removeChild(preview.node);
            preview = null;
        }
        this.tempState.preview = preview;
        this.tempState.outlinedDroppable = this.outlineDroppable(dropCandidate, outlinedDroppable);
    }

    dragEnd(elem) {
        console.log('dragEnd');
        const {outlinedDroppable} = this.tempState;
        if (outlinedDroppable) {
            const translate = /translate.*?\)/g;
            outlinedDroppable.node.classList.remove('droppable--outlined');
            elem.style.transform = elem.style.transform.replace(translate, '');
            this.tempState.outlinedDroppable = null;
        }
        const {index, type} = elem.dataset;

        const {preview} = this.tempState;
        if (preview) {
            const parentIndex = preview.parentIndex;
            const nextIndex = preview.nextIndex;
            const previewCol = preview.colNum;

            if (index)
                this.props.moveBlock(index, parentIndex, nextIndex, previewCol);
            else {
                this.props.addBlock(type, parentIndex, nextIndex, previewCol);
                elem.parentNode.removeChild(elem);
            }
            preview.node.parentNode.removeChild(preview.node); // TODO  unsubscribe Block from drag
        } else if (index)
            this.props.deleteBlock(index);

        this.tempState.preview = null;
        elem.style.top = 0;
        elem.style.left = 0;
        elem.classList.remove('draggable--moved');
    }

    dragPredicate() {
        return this.tempState.enableDragging;
    }

    moveResizeLine(x) {
        const resizeLine = document.querySelector('.resize-line');
        if (resizeLine) resizeLine.style.left = `${x}px`;
    }

    resize(elem, {side, direction, x, index}) {
        const multiply = side === 'left' ? -1 : 1;
        const siblingNum = elem.parentNode.children.length - 1;

        const getColNum = (elem) => {
            const elemColEnd = elem.className.indexOf('--col-') + 6;
            return parseInt(elem.className.substr(elemColEnd, 2), 10);
        };

        const elemCol = getColNum(elem);

        if (elemCol === 12 - siblingNum && direction === multiply) return;
        if (elemCol === 1 && direction === (-1) * multiply) return;

        this.moveResizeLine(x);

        const parentRect = elem.parentNode.getBoundingClientRect();
        const colWidth = parentRect.width / 12;
        const prevSiblingColWidth = [...elem.parentNode.children]
            .slice(0, index)
            .reduce((acc, item) => acc + getColNum(item), 0) * colWidth;
        const dif = x - parentRect.left - prevSiblingColWidth - (side === 'right'? elemCol * colWidth : 0);
        const movementColNum = Math.floor(Math.abs(dif) / colWidth);
        // console.log('x', x, 'left', elemRect.left, 'width', colWidth, 'dif', dif);

        if (movementColNum > 0) {
            console.log('movementColNum', movementColNum);

            const getSibling = (elem, side) => side === 'left' ? elem.previousSibling : elem.nextSibling;
            const neighbour = getSibling(elem, side);

            if (neighbour) {

                const neighbourCol = getColNum(neighbour);
                console.log('neighbourCol', neighbourCol);
                if (neighbourCol === 1 && direction === multiply) return;

                const newElemCol = elemCol + movementColNum * direction * multiply;
                elem.classList.remove(`block--col-${elemCol}`);
                elem.classList.add(`block--col-${newElemCol}`);
                elem.dataset.side = side;

                const newNeighbourCol = neighbourCol + movementColNum * direction * (-1) * multiply;
                neighbour.classList.remove(`block--col-${neighbourCol}`);
                neighbour.classList.add(`block--col-${newNeighbourCol}`);
            }
        }
    }

    resizeReady(state) {
        this.tempState.enableDragging = !state;
    }

    resizeStart(elem, pos) {
        console.log('resizeStart');
        const elemRect = elem.getBoundingClientRect();
        const resizeLine = document.createElement('div');
        resizeLine.classList.add('resize-line');
        resizeLine.style.height = `${elemRect.height}px`;
        resizeLine.style.top = `${elemRect.top}px`;
        resizeLine.style.left = `${pos.x}px`;
        document.body.appendChild(resizeLine);
    }

    onResize(elem, {direction, side, x}) {
        const {index} = elem.dataset;
        const normalIndex = +index.slice(-2)[0];

        if (direction === 0) return;
        if (side === 'left' && normalIndex === 0) return; // if element first and side left
        if (side === 'right' && normalIndex === elem.parentNode.children.length - 1) return; //// if element last and side right

        this.resize(elem, {direction, side, x, index: normalIndex});
    }

    resizeEnd(elem) {
        console.log('resizeEnd');

        const getColNum = (elem) => {
            const elemColEnd = elem.className.indexOf('--col-') + 6;
            return parseInt(elem.className.substr(elemColEnd, 2), 10);
        };

        const resizeLine = document.querySelector('.resize-line');
        if(resizeLine) resizeLine.parentNode.removeChild(resizeLine);

        const {index, side} = elem.dataset;
        this.props.resizeBlock(index, getColNum(elem), side);
    }

    resizePredicate() {
        return this.tempState.enableResizing;
    }

    initDraggable(elem) {
        if (!elem) return;
        console.log('initDraggable');

        elem.classList.add('draggable');
        // this.tempState = {...this.tempState, draggables: [...this.tempState.draggables, {node: elem}]};
        resize.create(elem, {
            resizeReady: ::this.resizeReady,
            onResize: ::this.onResize,
            resizePredicate: ::this.resizePredicate,
            resizeStart: ::this.resizeStart,
            resizeEnd: ::this.resizeEnd,
        });

        return create(elem, {
            onDrag: ::this.onDrag,
            dragStart: ::this.dragStart,
            dragEnd: ::this.dragEnd,
            dragPredicate: ::this.dragPredicate
        })
    }

    initGrid(elem) {
        if (!elem) return;
        const rect = elem.getBoundingClientRect();
        this.tempState = {...this.tempState, grids: [...this.tempState.grids, {node: elem, rect, level: 0}]};

        const parentRect = elem.getBoundingClientRect();
        const colWidth = parentRect.width / 12;
        Array(11).fill(1).forEach((item, index)=>{
            const gridLine = document.createElement('div');
            gridLine.style.height = parentRect.height + 'px';
            gridLine.style.top = parentRect.top + 'px';
            gridLine.style.left = parentRect.left + colWidth * (index+1) + 'px';
            gridLine.classList.add('grid-line');
            document.body.appendChild(gridLine);
        })
    }

    render() {
        return (
            <div>
                <Menu initDraggable={::this.initDraggable}/>
                <WorkArea blocks={this.props.blocks} initGrid={::this.initGrid} initDraggable={::this.initDraggable}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    // console.log(state);
    return {blocks: [...state.present.blocks]};
};

export default connect(mapStateToProps, {addBlock, moveBlock, deleteBlock, resizeBlock})(App);