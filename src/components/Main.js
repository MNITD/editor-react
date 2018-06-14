import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {getDocuments} from '../actions/fetchActions';
import Header from './Header';

import '../styles/Main.scss';

class Main extends Component {
    constructor(props){
        super(props);
        props.getDocuments();//.then(documents => this.setState({...this.state, documents}));
    }
    getDocumentList(){
        const {documents} = this.props;
        return documents.map(({name, id, link}) => (
                <li key={id} className={'main__item'}>
                    <span className={'main__name'}>{name}</span>
                    <NavLink to={`/edit/${id}`}>Edit</NavLink>
                    {link? (<NavLink to={link}>link</NavLink>): ''}
                </li>
            )
        );
    }
    render(){
        return (
            <div className={'main'}>
                <Header/>
                <ul className={'main__list'}>
                    {this.getDocumentList()}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    const {documents: {all}}= state;
    return {documents: all};
};

export default connect(mapStateToProps, (dispatch) => ({getDocuments: getDocuments(dispatch)}) )(Main);