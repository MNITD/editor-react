/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import WorkArea from '../containers/WorkArea';
import SidePanel from './SidePanel';
import {create} from '../lib/drag';
import addBlock from '../actions/addBlock.action'
import {connect}  from 'react-redux';

//style
import '../styles/main.scss';
import '../styles/drag_n_drop.scss';

class App extends Component {
    constructor() {
        super();
        this.state = {draggables: []};
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
        const getArea = ({rect: {left, right}}, index) => {
            if (left < elemRect.left)
                return {area: right - elemRect.left, direction: index===candidates.length -1? 'after': 'before'};

            return {area: elemRect.right -left, direction: index===0? 'before' : 'after'}
        };
        return candidates
            .map((item) => ({node: item, rect: item.getBoundingClientRect()} ))
            .filter(({rect: {left, right}}) => (
                ( left < elemRect.left && right > elemRect.left ) || ( left < elemRect.right && right > elemRect.right ))
            )
            .map((item, index) => ({...item, ...getArea(item, index)}))
            .sort((a, b) => b.area - a.area);
    };

    updatePreview(oldPreview, dropCandidates, {node, direction}) {
        let preview = oldPreview;
        if (dropCandidates[0]) {
            if(preview){
                if(preview === node) return preview;
                preview.parentNode.removeChild(preview);
            }
            preview = document.createElement('div');
            preview.classList.add('draggable-preview');
            const previewPadding = 44;
            preview.style.height = dropCandidates[0].rect.height - previewPadding + 'px';
            const insertAfter = (preview, {parentNode, nextSibling}) => {
                if (nextSibling)
                    parentNode.insertBefore(preview, nextSibling);
                else
                   parentNode.appendChild(preview);
            };
            const parentNode = dropCandidates[0].node;
            switch(direction){
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
        if (preview)
            preview.parentNode.replaceChild(elem, preview);
        else
            elem.parentNode.removeChild(elem);

    }

    outlineDroppable(dropCandidates, oldOutlined) {
        let outlined = oldOutlined;
        if (dropCandidates.length > 0) {
            if (outlined) outlined.node.classList.remove('droppable--outlined');
            dropCandidates[0].node.classList.add('droppable--outlined');
            outlined = dropCandidates[0];
        }

        return outlined;
    }

    // recalculateGrids(grids) {
    //     return grids.map((grid) => ({...grid, rect: grid.node.getBoundingClientRect()}));
    // }

    onDrag(elem, pos) {
        const dropCandidates = this.findDropCandidates(elem, this.tempState.grids);
        if (dropCandidates.length > 0) {
            const neighbours = this.findNeighbours(elem, [...dropCandidates[0].node.children]);
            if (neighbours.length === 0)
                this.tempState.preview = this.updatePreview(this.tempState.preview, dropCandidates, {});
            else
                this.tempState.preview = this.updatePreview(this.tempState.preview, dropCandidates, neighbours[0]);
        }

        this.tempState.outlinedDroppable = this.outlineDroppable(dropCandidates, this.tempState.outlinedDroppable);
    }

    dragStart(elem, {clientX, clientY}) {

        if (elem.parentNode.classList.contains('component-list')) {
            const copy = elem.cloneNode(true);
            elem.parentNode.replaceChild(copy, elem);
            this.initDraggable(copy);
            console.log('copy')
        }

        document.body.appendChild(elem);

        elem.classList.add('draggable--moved');
        const {height, width} = elem.getBoundingClientRect();
        elem.style.top = `${clientY - height / 2 + window.scrollY}px`;
        elem.style.left = `${clientX - width / 2 + window.scrollX}px`;
        console.log(elem.style.left, elem.style.top);
    }

    dragEnd(elem) {
        if (this.tempState.outlinedDroppable) {
            const translate = /translate.*?\)/g;
            this.tempState.outlinedDroppable.node.classList.remove('droppable--outlined');
            elem.parentNode.removeChild(elem);
            console.log(elem.style.transform);
            elem.style.transform = elem.style.transform.replace(translate, '');
            this.tempState.outlinedDroppable.node.appendChild(elem);
            this.tempState.outlinedDroppable = null;
        }
        this.dropElement(this.tempState.preview, elem);
        this.tempState.preview = null;
        elem.style.top = 0;
        elem.style.left = 0;
        elem.classList.remove('draggable--moved');
    }

    dragPredicate() {
        return true;
    }

    initDraggable(elem) {
        elem.classList.add('draggable');
        this.tempState = {...this.tempState, draggables: [...this.tempState.draggables, elem]};
        create(elem, {
            onDrag: ::this.onDrag,
            dragStart: ::this.dragStart,
            dragEnd: ::this.dragEnd,
            dragPredicate: ::this.dragPredicate
        })
    }

    initGrid(elem) {
        const rect = elem.getBoundingClientRect();
        this.tempState = {...this.tempState, grids: [...this.tempState.grids, {node: elem, rect, level: 0}]};
    }

    componentDidMount() {
        console.log(this.tempState, this.props.blocks, this.props.addBlock);
    }

    render() {
        return (
            <div>
                <SidePanel initDraggable={::this.initDraggable}/>
                <WorkArea initGrid={::this.initGrid}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    blocks: [...state.blocks]
});


export default connect(mapStateToProps, {addBlock})(App);