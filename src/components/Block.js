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
        const tokens = d.split(' ');
        const max = tokens.reduce((max, item) => {
                if (+item > max) return +item;
                return max;
            },
            0);
        // console.log(width, max);
        let isEven = true;
        const diff =  width - max;
        return tokens.map(token => {
            let comma = '';
            if(token.slice(-1) === ',') comma = ',';
            else if (isNaN(+token)) return token;

            isEven = !isEven;
            if(!isEven && parseFloat(token) > 10)  return (parseFloat(token) + diff) + comma ;
            return token;

        }).reduce((acc, token) => acc + ' ' + token);
    }

    updateShadowRoot(elem){
        if (elem.shadowRoot){
            elem.shadowRoot.querySelector('.overlay').children[0].style.width = '100%';
            const {width} = elem.getBoundingClientRect();
            if(width < 50) return;
            const pathElem = elem.shadowRoot.querySelector('.overlay').children[0].children[0];
            const d = pathElem.getAttribute('d');
            pathElem.setAttribute('d', this.recalculatePath({width, d}));
        }
    }

    componentDidMount() {
        console.log('componentDidMount', this.blockRef);
        const {col} = this.blockRef.dataset;
        this.blockRef.classList.add('block');
        this.blockRef.classList.add(`block--col-${col}`);

        this.updateShadowRoot(this.blockRef);

        this.subscription = this.props.initDraggable(this.blockRef);
        // TODO subscribe for drag
    }

    componentDidUpdate() {
        if(this.blockRef.parentNode && this.blockRef.parentNode.classList.contains('menu__tab-subsection')) return;
        console.log('componentDidUpdate',  this.blockRef);

        const {col} = this.blockRef.dataset;
        const prevClass = [...this.blockRef.classList].find(item => item.match(/(block--col-)\w+/g));
        this.blockRef.classList.remove(prevClass);
        this.blockRef.classList.add(`block--col-${col}`);

        this.updateShadowRoot(this.blockRef);

    }

    componentWillUnmount() {
        console.log('unmount');
        this.subscription.unsubscribe();
        //TODO unsubscribe from drag
    }
}

export default Block;