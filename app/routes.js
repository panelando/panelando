import React, { Component } from 'react'
import { hashHistory, Router, Route, Link, withRouter } from 'react-router'

import Layout from './screens/layout'
import Login from './screens/login'
import Logout from './screens/logout'
import About from './screens/about'
import Dashboard from './screens/dashboard'

const App = () => (
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="about" component={About} />
      <Route path="dashboard" component={Dashboard} />
    </Route>
  </Router>
)

export default App
