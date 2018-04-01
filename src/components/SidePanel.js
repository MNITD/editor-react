/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import ComponetList from '../containers/ComponentList';
import HierarchyTree from '../containers/HierarchyTree';


// style
import '../styles/SidePanel.scss';

class SidePanel extends Component{
    constructor(){
        super();
    }
    render(){
        return (
            <aside className="side-panel">
                <ComponetList initDraggable={::this.props.initDraggable}/>
                <HierarchyTree/>
            </aside>
        );
    }
}

export default SidePanel;