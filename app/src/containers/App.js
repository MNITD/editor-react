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
import {addBlock, moveBlock, deleteBlock} from '../actions/blockActions';

//style
import '../styles/main.scss';
import '../styles/drag_n_drop.scss';

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

    resizeReady(state) {
        this.tempState.enableDragging = !state;
    }

    resizeStart() {
        console.log('resizeStart')
    }

    onResize(elem, {direction, side, x}) {
        const {index} = elem.dataset;
        const siblingNum = elem.parentNode.children.length - 1;

        if (direction === 0) return;

        if (side === 'left') {
            if (+index.slice(-2)[0] === 0) return; // if element first and side left

            const elemColEnd = elem.className.indexOf('--col-') + 6;
            const elemCol = parseInt(elem.className.substr(elemColEnd, 2), 10);
            if (elemCol === 12 - siblingNum && direction === -1) return;
            if (elemCol === 1 && direction === 1) return;

            const elemRect = elem.getBoundingClientRect();
            const colWidth = elemRect.width / elemCol;
            const dif = x - elemRect.left - (direction * colWidth);
            console.log('x', x, 'left', elemRect.left, 'width', colWidth, 'dif', dif);
            if (Math.abs(dif) <= 5) {
                elem.classList.remove(`block--col-${elemCol}`);
                elem.classList.add(`block--col-${elemCol - direction}`);

                const neighbour = elem.previousSibling;

                if (neighbour) {
                    const neighbourColEnd = neighbour.className.indexOf('--col-') + 6;
                    const neighbourCol = parseInt(neighbour.className.substr(neighbourColEnd, 2), 10);
                    console.log('neighbourCol', neighbourCol);
                    if (neighbourCol === 1 && direction === -1) return;
                    neighbour.classList.remove(`block--col-${neighbourCol}`);
                    neighbour.classList.add(`block--col-${neighbourCol + direction}`);
                }
            }


        }

        if (side === 'right') {
            if (+index.slice(-2)[0] === elem.parentNode.children.length - 1) return; // if element last and side right

            const elemColEnd = elem.className.indexOf('--col-') + 6;
            const elemCol = parseInt(elem.className.substr(elemColEnd, 2), 10);
            if (elemCol === 12 - siblingNum && direction === 1) return;
            if (elemCol === 1 && direction === -1) return;

            const elemRect = elem.getBoundingClientRect();
            const colWidth = elemRect.width / elemCol;
            const dif = x - elemRect.right - (direction * colWidth);
            console.log('x', x, 'left', elemRect.right, 'width', colWidth, 'dif', dif);
            if (Math.abs(dif) <= 5) {
                elem.classList.remove(`block--col-${elemCol}`);
                elem.classList.add(`block--col-${elemCol + direction}`);

                const neighbour = elem.nextSibling;

                if (neighbour) {
                    const neighbourColEnd = neighbour.className.indexOf('--col-') + 6;
                    const neighbourCol = parseInt(neighbour.className.substr(neighbourColEnd, 2), 10);
                    if (neighbourCol === 1 && direction === 1) return;
                    neighbour.classList.remove(`block--col-${neighbourCol}`);
                    neighbour.classList.add(`block--col-${neighbourCol - direction}`);
                }
            }
        }

    }

    resizeEnd() {
        console.log('resizeEnd');
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
            resizeStart: this.resizeStart,
            resizeEnd: this.resizeEnd,
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

export default connect(mapStateToProps, {addBlock, moveBlock, deleteBlock})(App);