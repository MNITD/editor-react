/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import WorkArea from '../containers/WorkArea';
import SidePanel from './sidepanel/SidePanel';
import {create} from '../lib/drag';

//style
import '../styles/main.scss';

class App extends Component{
    constructor(){
        super();
    }
    render(){
        return (
            <div>
                <SidePanel/>
                <WorkArea/>
            </div>
        );
    }
}

export default App;