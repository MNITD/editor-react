import React from 'react';
import { NavLink, withRouter} from 'react-router-dom';
import {createDocument} from '../api';

import '../styles/Header.scss';


export default  withRouter(({history}) => (
    <header className={'header'}>
        <button onClick={() => {createDocument().then(({id})=>history.push(`/edit/${id}`));}}>New</button>
        <NavLink to={'/login'} className={'header__login-btn'}>Login</NavLink>
    </header>
));