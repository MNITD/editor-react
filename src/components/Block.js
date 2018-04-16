/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';

// style
import '../styles/Block.scss';

class Block extends Component{
    render(){
        return (
            <div className={`block block--flex-${this.props.data.flex}`} ref={this.props.initDraggable}>
                {this.props.data.type}
            </div>
        );
    }
}

export default Block;