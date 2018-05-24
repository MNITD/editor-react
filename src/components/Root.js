/**
 * Created by bogdan on 28.03.18.
 */
import React from 'react';
import App from '../containers/App';
import Main from '../components/Main';
import {Provider} from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const Root = ({store}) => (
    <Provider store={store}>
        <Router>
            <Route path="/" component={Main}/>
        </Router>
        {/*<App/>*/}
    </Provider>
);

export default Root; 