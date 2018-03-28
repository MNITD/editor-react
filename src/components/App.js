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

class App extends Component{
    constructor(){
        super();
        this.state = {draggables: []};
        this.tempState = {draggables:[], grids:[]};
    }
    findDropCandidates (elem, droppables){
        const elemRect = elem.getBoundingClientRect();

        return droppables
            .filter(({rect: {left, top}}) => (left < elemRect.right && top < elemRect.bottom))
            .map(item => ({...item, dist: Math.abs( (item.rect.left - elemRect.left) * (item.rect.top - elemRect.top) )}))
            .sort((a, b) => a.dist - b.dist);
        // .sort((a, b) => b.level - a.level);
    };

    updatePreview(elem, oldPreview, dropCandidates, draggables) {
        let preview = oldPreview;
        if (dropCandidates[0]){// && checkIntersection(draggables, dropCandidates[0], elem)) {
            if (preview) preview.parentNode.removeChild(preview);
            preview = document.createElement('div');
            preview.classList.add('draggable-preview');
            preview.style.height = elem.style.height;
            preview.style.top = elem.style.top;
            dropCandidates[0].node.appendChild(preview);
        }
        return preview;
    };

    outlineDroppable(dropCandidates, oldOutlined){
        let outlined = oldOutlined;
        if(dropCandidates.length > 0){
            if(outlined) outlined.node.classList.remove('droppable--outlined');
            dropCandidates[0].node.classList.add('droppable--outlined');
        }
        outlined = dropCandidates[0];
        return outlined;
    }

    onDrag(elem, pos){
        const dropCandidates = this.findDropCandidates(elem, this.tempState.grids);
        this.tempState.preview = this.updatePreview(elem, this.tempState.preview, dropCandidates, this.tempState.draggables);
        this.tempState.outlinedDroppable = this.outlineDroppable(dropCandidates, this.tempState.outlinedDroppable);
    }
    dragStart(elem, pos){
        // console.log('dragStart');
        elem.classList.add('draggable--moved');
    }
    dragEnd(elem){
        this.tempState.outlinedDroppable.node.classList.remove('droppable--outlined');
        this.tempState.outlinedDroppable = null;
        elem.classList.remove('draggable--moved');

    }
    dragPredicate(){
        return true;
    }
    initDraggable(elem){
        elem.classList.add('draggable');
        this.tempState = {...this.tempState, draggables: [...this.tempState.draggables, elem]};
        const {onDrag, dragStart, dragEnd, dragPredicate} = this;
        create(elem, {onDrag: ::this.onDrag, dragStart, dragEnd: ::this.dragEnd, dragPredicate})
    }

    initGrid(elem){
        const rect = elem.getBoundingClientRect();
        this.tempState = {...this.tempState, grids: [...this.tempState.grids, {node: elem, rect}]};
    }

    componentDidMount(){
        console.log(this.tempState);
    }

    render(){
        return (
            <div>
                <SidePanel initDraggable={::this.initDraggable}/>
                <WorkArea initGrid={::this.initGrid}/>
            </div>
        );
    }
}

export default App;