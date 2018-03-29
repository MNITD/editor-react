/**
 * Created by bogdan on 22.02.18.
 */
import ReactDOM from 'react-dom';
import React from 'react';
import Root from './components/Root';

import configureStore from './redux/configureStore';

const store = configureStore();

ReactDOM.render(<Root store={store}/>,
    document.getElementById('root'));