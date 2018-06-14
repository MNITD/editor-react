/**
 * Created by bogdan on 22.02.18.
 */
import React, {Component} from 'react';
import Block from '../components/Block';

// style
// import './BlockList.scss';

class BlockList extends Component {
    constructor() {
        super();
        this.state = {
            blocks: [
                {
                    name: 'Primary',
                    items: [
                        {blockType: 'Text', col: 12},
                        {blockType: 'Regular', col: 12},
                        {blockType: 'Empty', col: 12},
                        // {blockType: 'WiredButton', col: 12},
                        // {blockType: 'WiredInput', col: 12},
                    ],
                },
                // {
                //     name: 'Secondary',
                //     items: [
                //         {blockType: 'Text', col:12},
                //         {blockType: 'Regular', col: 12},
                //     ]
                // },
            ],
        };
    }

    componentDidMount(){
        console.log('BlockList', 'componentDidMount');
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
                    <Block data={item} initDraggable={::this.props.initDraggable}>{item.blockType}</Block>
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

export default BlockList;