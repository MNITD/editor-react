/**
 * Created by bogdan on 28.03.18.
 */
import React from 'react';
import App from '../containers/App';
import Main from './Main';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './Login';

const Root = ({store}) => (
    <Provider store={store}>
        <Router>
            <div>
                <Route path="/" exact={true} component={Main}/>
                {/*<Route path="/" exact={true} component={Login}/>*/}
                <Route path="/login" component={Login}/>
                <Route path="/edit/:id" component={App}/>
                {/*<Route path="/" exact={true} component={App}/>*/}
            </div>
        </Router>
        {/*<App/>*/}
    </Provider>
);

export default Root; 