import React from 'react';
import { NavLink } from 'react-router-dom';

import '../styles/Header.scss';

export default  () => (
    <header className={'header'}>
        <NavLink to={'/login'} className={'header__login-btn'}>Login</NavLink>
    </header>
);