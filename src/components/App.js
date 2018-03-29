/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import WorkArea from '../containers/WorkArea';
import SidePanel from './sidepanel/SidePanel';
import {create} from '../lib/drag';

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
        const centerH = elemRect.top  + window.scrollY + elemRect.height / 2;
        const centerW = elemRect.left + window.scrollX + elemRect.width / 2;

        return droppables
            .filter(({rect: {left, right}}) => (left < centerW && right > centerW))
            .filter(({rect: {top, bottom}}) => (top < centerH && bottom > centerH))
            .sort((a, b) => b.level - a.level);
    };

    updatePreview(elem, oldPreview, dropCandidates, draggables) {
        let preview = oldPreview;
        if (dropCandidates[0]) {// && checkIntersection(draggables, dropCandidates[0], elem)) {
            if (preview) preview.parentNode.removeChild(preview);
            preview = document.createElement('div');
            preview.classList.add('draggable-preview');
            dropCandidates[0].node.appendChild(preview);
            // preview.style.zIndex = -1;
            preview.style.height = dropCandidates[0].rect.height - 42 + 'px';//elem.style.height;
        }
        return preview;
    };

    replacePreviewWith(preview, elem) {
        if (preview) {
            elem.parentNode.removeChild(elem);
            preview.parentNode.replaceChild(elem, preview);
        }
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
        // console.log(elem.style.transform);
        console.log('top', elem.style.top, 'rectTop', elem.getBoundingClientRect().top + window.scrollY);
        const dropCandidates = this.findDropCandidates(elem, this.tempState.grids);
        this.tempState.preview = this.updatePreview(elem, this.tempState.preview, dropCandidates, this.tempState.draggables);
        this.tempState.outlinedDroppable = this.outlineDroppable(dropCandidates, this.tempState.outlinedDroppable);
    }

    dragStart(elem, pos) {

        const {top, left} = elem.getBoundingClientRect();

        elem.style.top = `${top + window.scrollY}px`;
        elem.style.left = `${left + window.scrollX}px`;
        // console.log('style.top,',  elem.style.top);
        if (elem.parentNode.classList.contains('component-list')) {
            const copy = elem.cloneNode(true);
            elem.parentNode.replaceChild(copy, elem);
            console.log('copy')
        }
        document.body.appendChild(elem);
        elem.classList.add('draggable--moved');

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
        this.replacePreviewWith(this.tempState.preview, elem);
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
        console.log(this.tempState);
        // window.addEventListener('scroll', () => {
        //     console.log('recalulation');
        //     this.tempState.grids = this.recalculateGrids(this.tempState.grids)
        // })
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

export default App;