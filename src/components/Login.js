import React from 'react';

import '../styles/Login.scss';
import {login as logIn} from '../api';


class Login extends React.Component {
    handleSubmit(event) {
        event.preventDefault();
        const {login, password} = this.state;


        logIn({login, password}); // TODO save credentials to storage
    };

    handleChange(property, {target: {value}}) {
        console.log(property, value);
        this.setState({[property]: value});
    }

    render() {
        return <div className={'login'}>
            <form onSubmit={this.handleSubmit.bind(this)}>
                <label className='login__label' htmlFor="login">Login</label>
                <input id='login' name='login' type='text' onChange={this.handleChange.bind(this, 'login')}/>
                <label className='login__label' htmlFor="password">Password</label>
                <input id='password' name='password' type='password'
                       onChange={this.handleChange.bind(this, 'password')}/>

                <button className='login__btn' type='submit'>Log in</button>
            </form>
        </div>;
    };
}

export default Login;