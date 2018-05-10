/**
 * Created by bogdan on 22.02.18.
 */
import React, {Component} from 'react';
import Grid from '../components/Grid';
import Block from '../components/Block';


import '../styles/WorkArea.scss';

class WorkArea extends Component {
    constructor(props) {
        super(props);
        this.setRef = (elem) => {
            this.elemRef = elem;
        };
    }

    getChildren(blocks, parentIndex = '') {
        return blocks.map((block, index) => {
                const newIndex = `${parentIndex}${index}L`;
            return <Block key={index} index={newIndex} data={block}
                          initDraggable={::this.props.initDraggable}>{block.content}</Block>
            }
        );
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
            <main className="work-area" ref={this.setRef}>
                {this.getGrids(this.props.blocks)}
            </main>
        );
    }

    componentDidMount() {
        this.props.initWorkArea(this.elemRef);
    }
}

export default WorkArea;