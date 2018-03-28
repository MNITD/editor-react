/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import ComponentItem from '../components/component_item/ComponentItem';

// style
// import './ComponentList.scss';

class ComponentList extends Component{
    constructor(){
        super();
        this.state = {
            items: [
                {name: 'ComponentItem'},
                {name: 'ComponentItem'},
                {name: 'ComponentItem'},
                {name: 'ComponentItem'},
                {name: 'ComponentItem'},
                {name: 'ComponentItem'},
            ]
        }
    }

    getItems(){
        return this.state.items
            .map( (item, index) => <ComponentItem key={index} data={item}/>);
    }

    render(){
        return (
            <div>
                {this.getItems()}
            </div>
        );
    }
}

export default ComponentList;