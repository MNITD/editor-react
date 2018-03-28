/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import Grid from '../components/grid/Grid'


import '../styles/WorkArea.scss';

class WorkArea extends Component{
    constructor() {
        super();
    }
    render(){
        return (
            <main className="work-area">
                <Grid initGrid={::this.props.initGrid}/>
                <Grid initGrid={::this.props.initGrid}/>
                <Grid initGrid={::this.props.initGrid}/>
            </main>
        );
    }
}

export default WorkArea;