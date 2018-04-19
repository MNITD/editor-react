/**
 * Created by bogdan on 28.03.18.
 */
import React from 'react';
import App from './App';
import {Provider} from 'react-redux';

const Root = ({store}) => (
    <Provider store={store}>
        <App/>
    </Provider>
);

export default Root; 