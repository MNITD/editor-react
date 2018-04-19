/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import Grid from '../components/Grid';
import Block from '../components/Block';


import '../styles/WorkArea.scss';

class WorkArea extends Component {
    getChildren(blocks, parentIndex = '') {
        const children = blocks.map((block, index) => {
                const newIndex = `${parentIndex}${index}L`;
                return <Block key={index} index={newIndex} data={block} initDraggable={::this.props.initDraggable}/>
            }
        );
        // console.log(children);
        return children;
    }

    getGrids(grids, parentIndex = '') {
        return grids.map((grid, index) => {
                const newIndex = `${parentIndex}${index}L`;
                return <Grid key={index} index={newIndex} initGrid={::this.props.initGrid}>
                    {this.getChildren(grid.children, newIndex)}
                </Grid>
            }
        )
    }

    render() {
        return (
            <main className="work-area">
                {this.getGrids(this.props.blocks)}
            </main>
        );
    }
}

export default WorkArea;