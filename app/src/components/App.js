/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import WorkArea from '../containers/WorkArea';
import Menu from './Menu';
import {create} from '../lib/drag';
import {connect} from 'react-redux';
import {addBlock, moveBlock, deleteBlock} from '../actions/blockActions';

//style
import '../styles/main.scss';
import '../styles/drag_n_drop.scss';

class App extends Component {
    constructor(props) {
        super(props);

        this.tempState = {draggables: [], grids: []};
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
            const center =  left + width / 2 ;
            if (left < elemRect.left)
                return {area: right - elemRect.left, direction: elemCenter > center ? 'after' : 'before'};

            return {area: elemRect.right - left, direction: elemCenter < center? 'before' : 'after'}
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

    createPreview({rect: {height}}) {
        const previewPadding = 44;
        let preview = document.createElement('div');
        preview.classList.add('draggable-preview');
        preview.style.height = height - previewPadding + 'px';
        return preview;
    }

    updatePreview(oldPreview, dropCandidate, {node, direction}) {
        let preview = oldPreview;
        if (dropCandidate) {
            if (preview) {
                if (preview === node) return preview;
                preview.parentNode.removeChild(preview);
            }
            preview = this.createPreview(dropCandidate);
            const insertAfter = (preview, {parentNode, nextSibling}) => {
                if (nextSibling)
                    parentNode.insertBefore(preview, nextSibling);
                else
                    parentNode.appendChild(preview);
            };
            const parentNode = dropCandidate.node;
            switch (direction) {
                case 'before':
                    parentNode.insertBefore(preview, node);
                    break;
                case 'after':
                    insertAfter(preview, node);
                    break;
                default:
                    parentNode.appendChild(preview);
                    break;
            }
        }
        return preview;
    };

    dropElement(preview, elem) {
        if (preview){
            // preview.parentNode.replaceChild(elem, preview);
            return true;
        }
        // if(elem.parentNode)
            // elem.parentNode.removeChild(elem);
        return false;

    }

    outlineDroppable(dropCandidate, oldOutlined) {
        let outlined = oldOutlined;
        if (dropCandidate) {
            if (outlined) outlined.node.classList.remove('droppable--outlined');
            dropCandidate.node.classList.add('droppable--outlined');
            outlined = dropCandidate;
        }

        return outlined;
    }

    onDrag(elem, pos) {
        let {preview} = this.tempState;
        const {grids, outlinedDroppable} = this.tempState;
        const [dropCandidate] = this.findDropCandidates(elem, grids);

        if (dropCandidate) {
            const [neighbour] = this.findNeighbours(elem, [...dropCandidate.node.children]);
            if (neighbour)
                preview = this.updatePreview(preview, dropCandidate, neighbour);
            else
                preview = this.updatePreview(preview, dropCandidate, {});

        } else if (preview) {
            preview.parentNode.removeChild(preview);
            preview = null;
        }
        this.tempState.preview = preview;
        this.tempState.outlinedDroppable = this.outlineDroppable(dropCandidate, outlinedDroppable);
    }

    dragStart(elem, {clientX, clientY}) {

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
        console.log(elem.style.left, elem.style.top);
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
        if(preview){
            const parentIndex = preview.parentNode.dataset.index;
            const nextIndex = preview.nextSibling? preview.nextSibling.dataset.index : null;

            if(index)
                this.props.moveBlock(index, parentIndex, nextIndex); // TODO add flex
            else{
                this.props.addBlock(type, parentIndex, nextIndex); // TODO add flex
                elem.parentNode.removeChild(elem);
            }
            preview.parentNode.removeChild(preview); // TODO  unsubscribe Block from drag
        } else if(index)
            this.props.deleteBlock(index);

        this.tempState.preview = null;
        elem.style.top = 0;
        elem.style.left = 0;
        elem.classList.remove('draggable--moved');
    }

    dragPredicate() {
        return true;
    }

    initDraggable(elem) {
        if(!elem) return;
        console.log('initDraggable', elem);
        elem.classList.add('draggable');
        // this.tempState = {...this.tempState, draggables: [...this.tempState.draggables, {node: elem}]};
        return create(elem, {
            onDrag: ::this.onDrag,
            dragStart: ::this.dragStart,
            dragEnd: ::this.dragEnd,
            dragPredicate: ::this.dragPredicate
        })
    }

    initGrid(elem) {
        if(!elem) return;
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
    return{blocks: [...state.present.blocks]};
};

export default connect(mapStateToProps, {addBlock, moveBlock, deleteBlock})(App);