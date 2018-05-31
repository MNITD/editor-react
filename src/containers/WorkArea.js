/**
 * Created by bogdan on 22.02.18.
 */
import React, {Component} from 'react';
import Grid from '../components/Grid';
import Block from '../components/Block';


import '../styles/WorkArea.scss';

class WorkArea extends Component {
    getChildren(blocks, parentIndex = '') {
        return blocks.map((block, index) => {
                const newIndex = `${parentIndex}${index}L`;
            return (<Block key={index} index={newIndex} data={block}
                          initDraggable={::this.props.initDraggable}>{block.content}</Block>);
            }
        );
    }

    getGrids(grids, parentIndex = '') {
        return grids.map((grid, index) => {
                const newIndex = `${parentIndex}${index}L`;
                return (<Grid key={index} index={newIndex}>
                    {this.getChildren(grid.children, newIndex)}
                </Grid>);
            }
        );
    }

    render() {
        return (
            <main className="work-area" ref={this.setRef}>
                {this.getGrids(this.props.blocks)}
            </main>
        );
    }
}

export default WorkArea;