/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import Grid from '../components/Grid';
import Block from '../components/Block';


import '../styles/WorkArea.scss';

class WorkArea extends Component{
    getChildren(blocks){
        return blocks.map((block, index) =>(
            <Block key={index} data={block} initDraggable={::this.props.initDraggable}/>
            )
        );
    }
    getGrids(grids){
        return grids.map((grid, index) => (
            <Grid key={index} initGrid={::this.props.initGrid}>
                {this.getChildren(grid.children)}
            </Grid>
            )
        )
    }
    render(){
        return (
            <main className="work-area">
                {this.getGrids(this.props.blocks)}
            </main>
        );
    }
}

export default WorkArea;