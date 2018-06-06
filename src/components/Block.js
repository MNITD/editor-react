/**
 * Created by bogdan on 22.02.18.
 */
import React, {Component} from 'react';
import 'wired-elements';
import {updateShadowRoot} from '../utils/shadowRoot';

// style
import '../styles/Block.scss';

class Block extends Component {
    constructor(props) {
        super(props);
        this.setRef = (elem) => {
            this.blockRef = elem;
        };
    }

    render() {
        const {index, data: {blockType, col}} = this.props;

        const wiredComponets = {
            WiredButton: 'wired-button',
            WiredInput: 'wired-input',
        };

        const WiredElement = wiredComponets[blockType];
        if (WiredElement) {
            return (
                <WiredElement data-index={index} data-type={blockType} data-col={col} ref={this.setRef}>
                    {this.props.children}
                </WiredElement>
            );
        }

        return (
            <div data-index={index} data-col={col} data-type={blockType} ref={this.setRef}>
                {this.props.children}
            </div>
        );
    }



    componentDidMount() {
        // console.log('componentDidMount', this.blockRef);
        const {col} = this.blockRef.dataset;
        this.blockRef.classList.add('block');
        this.blockRef.classList.add(`block--col-${col}`);

        updateShadowRoot(this.blockRef);

        this.subscription = this.props.initDraggable(this.blockRef);
        // TODO subscribe for drag
    }

    componentDidUpdate() {
        if(this.blockRef.parentNode && this.blockRef.parentNode.classList.contains('menu__tab-subsection')) return;
        // console.log('componentDidUpdate',  this.blockRef);

        const {col} = this.blockRef.dataset;
        const prevClass = [...this.blockRef.classList].find(item => item.match(/(block--col-)\w+/g));
        this.blockRef.classList.remove(prevClass);
        this.blockRef.classList.add(`block--col-${col}`);

        updateShadowRoot(this.blockRef);

    }

    componentWillUnmount() {
        console.log('unmount');
        this.subscription.unsubscribe();
        //TODO unsubscribe from drag
    }
}

export default Block;