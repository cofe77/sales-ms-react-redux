import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
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