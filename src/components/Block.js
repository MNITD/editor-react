/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';

// style
import '../styles/Block.scss';

class Block extends Component{
    constructor(props){
        super(props);
        this.setRef = (elem) =>{
            this.blockRef = elem;
        };
    }

    render(){
        const {index, data:{blockType, col}} = this.props;
        return (
            <div className={`block block--col-${col}`} data-index={index} data-type={blockType} ref={this.setRef}>
                {blockType}
            </div>
        );
    }
    componentDidMount(){
        this.subscription = this.props.initDraggable(this.blockRef);
        // TODO subscribe for drag
    }
    componentWillUnmount(){
        console.log('unmount');
        this.subscription.unsubscribe();
        //TODO unsubscribe from drag
    }
}

export default Block;