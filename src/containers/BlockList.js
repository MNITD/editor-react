/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import Block from '../components/Block';

// style
// import './ComponentList.scss';

class ComponentList extends Component {
    constructor() {
        super();
        this.state = {
            blocks: [
                {
                    name: 'Primary',
                    items: [
                        {type: 'Text', flex: 12},
                        {type: 'Regular', flex: 12},
                    ]
                },
                {
                    name: 'Secondary',
                    items: [
                        {type: 'Text', flex: 12},
                        {type: 'Regular', flex: 12},
                    ]
                },
            ]
        }
    }

    getSections(sections) {
        return sections.map((section, index) => (
                <li key={index} className="menu__tab-section">
                    <span className="menu__tab-section-title">{section.name}</span>
                    <ul className="menu__tab-list">
                        {this.getItems(section.items)}
                    </ul>
                </li>
            )
        );
    }

    getItems(items) {
        return items.map((item, index) => (
                <li key={index} className="menu__tab-subsection">
                    <Block  data={item} initDraggable={::this.props.initDraggable}/>
                </li>
            )
        );
    }

    render() {
        return (
            <ul className="menu__tab-list menu__tab-list--primary">
                {this.getSections(this.state.blocks)}
            </ul>
        );
    }
}

export default ComponentList;