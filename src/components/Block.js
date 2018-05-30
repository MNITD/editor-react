/**
 * Created by bogdan on 22.02.18.
 */
import React, {Component} from 'react';
import 'wired-elements';
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

    recalculatePath({width, d}) {
        console.log(width);
        const tokens = d.split(' ');
        const max = tokens.reduce((max, item) => {
                if (+item > max) return +item;
                return max;
            },
            0);

        let isEven = true;
        const diff =  width - max;
        const newTokens = tokens.map(token => {
            let comma = '';
            if(token.slice(-1) === ',') comma = ',';
            else if (isNaN(+token)) return token;

            isEven = !isEven;
            if(!isEven && parseFloat(token) > 10)  return (parseFloat(token) + diff) + comma ;
            return token;

        }).reduce((acc, token) => acc + ' ' + token);
        console.log(d);
        console.log(newTokens);
        return newTokens;
    }

    componentDidMount() {
        console.log('componentDidMount', this.blockRef);
        const {col} = this.blockRef.dataset;
        this.blockRef.classList.add('block');
        this.blockRef.classList.add(`block--col-${col}`);
        if (this.blockRef.shadowRoot){
            this.blockRef.shadowRoot.querySelector('.overlay').children[0].style.width = '100%';
            const {width} = this.blockRef.getBoundingClientRect();
            const pathElem = this.blockRef.shadowRoot.querySelector('.overlay').children[0].children[0];
            const d = pathElem.getAttribute('d');
            pathElem.setAttribute('d', this.recalculatePath({width, d}));
        }


        this.subscription = this.props.initDraggable(this.blockRef);
        // TODO subscribe for drag
    }

    componentDidUpdate() {
        if(this.blockRef.parentNode && this.blockRef.parentNode.classList.contains('menu__tab-subsection')) return;
        console.log('componentDidUpdate',  this.blockRef);
        const {col} = this.blockRef.dataset;
        if (this.blockRef.shadowRoot) {
            const {width} = this.blockRef.getBoundingClientRect();
            const pathElem = this.blockRef.shadowRoot.querySelector('.overlay').children[0].children[0];
            const d = pathElem.getAttribute('d');
            pathElem.setAttribute('d', this.recalculatePath({width, d}));
        }

        const prevClass = [...this.blockRef.classList].find(item => item.match(/(block--col-)\w+/g));
        this.blockRef.classList.remove(prevClass);
        this.blockRef.classList.add(`block--col-${col}`);
    }

    componentWillUnmount() {
        console.log('unmount');
        this.subscription.unsubscribe();
        //TODO unsubscribe from drag
    }
}

export default Block;