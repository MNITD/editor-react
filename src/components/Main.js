import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import {getDocuments} from '../api';
import Header from './Header';

import '../styles/Main.scss';

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {documents: []};
        getDocuments().then(documents => this.setState({...this.state, documents}));
    }
    getDocumentList(){
        const {documents} = this.state;
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

export default Main;