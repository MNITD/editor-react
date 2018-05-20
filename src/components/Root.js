/**
 * Created by bogdan on 28.03.18.
 */
import React from 'react';
import App from '../containers/App';
import Main from '../components/Main';
import {Provider} from 'react-redux';

const Root = ({store}) => (
    <Provider store={store}>
        {/*<App/>*/}
        <Main/>
    </Provider>
);

export default Root; 