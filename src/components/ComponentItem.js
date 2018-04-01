/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';

// style
import '../styles/ComponentItem.scss';

class ComponentItem extends Component{
    constructor(){
        super();
    }
    render(){
        return (
            <div className="component-item" ref={this.props.initDraggable}>
                {this.props.data.name}
            </div>
        );
    }
}

export default ComponentItem;