/**
 * Created by bogdan on 28.03.18.
 */
import React from 'react';
import {Component} from 'react';

// style
import './Grid.scss';

class Grid extends Component{
    constructor(){
        super();
    }
    render(){
        return (
            <div className="grid" ref={this.props.initGrid}>
                Grid
            </div>
        );
    }
}

export default Grid;