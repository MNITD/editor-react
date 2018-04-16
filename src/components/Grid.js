/**
 * Created by bogdan on 28.03.18.
 */
import React from 'react';
import {Component} from 'react';

// style
import '../styles/Grid.scss';

class Grid extends Component{
    render(){
        return (
            <div className="grid" ref={this.props.initGrid}>
                {this.props.children}
            </div>
        );
    }
}

export default Grid;