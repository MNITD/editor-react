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
import '../styles/draggable.scss';

class App extends Component{
    constructor(){
        super();
    }
    onDrag(elem, pos){
        console.log('onDrag');
    }
    dragStart(elem, pos){
        console.log('dragStart');
        elem.classList.add('draggable--moved');
    }
    dragEnd(elem){
        console.log('dragEnd');
        elem.classList.remove('draggable--moved');
    }
    dragPredicate(){
        return true;
    }
    initDraggable(elem){
        elem.classList.add('draggable');
        create(elem, {
            onDrag: this.onDrag,
            dragStart: this.dragStart,
            dragEnd: this.dragEnd,
            dragPredicate: this.dragPredicate})
    }

    render(){
        return (
            <div>
                <SidePanel initDraggable={::this.initDraggable}/>
                <WorkArea/>
            </div>
        );
    }
}

export default App;