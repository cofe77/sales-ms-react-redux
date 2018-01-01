import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { createStore ,applyMiddleware,compose } from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './redux/index.redux'
import RouterMap from './routes';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

const middleware=[thunk];

if(process.env.NODE_ENV !== 'production'){
  middleware.push(createLogger())
}

const store=createStore(rootReducer,compose(
    applyMiddleware(...middleware),
    window.devToolsExtension?window.devToolsExtension():f=>f
));



ReactDOM.render(
    <Provider store={store}>
        {RouterMap}
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
