import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import AuthorizedRoute from './components/AuthorizedRoute';

import Home from './containers/Home/Home';
import Login from './containers/Login/Login';


export default (
      <Router>
        <Switch>
          <AuthorizedRoute exact path="/" component={Home} />
          <AuthorizedRoute path="/home" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route  component={Login} />
        </Switch>
      </Router>
)