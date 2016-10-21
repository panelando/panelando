import React, { Component } from 'react'
import { hashHistory, Router, Route, Link, withRouter } from 'react-router'
import { isLoggedIn } from './lib/auth'

import Layout from './screens/layout'
import Login from './screens/login'
import Logout from './screens/logout'
import About from './screens/about'
import Dashboard from './screens/dashboard'

const requireAuth = (nextState, replace, callback) => {
  isLoggedIn()
    .then(loggedIn => {
      if (!loggedIn) {
        replace({
          pathname: '/login',
          state: { nextPathname: nextState.location.pathname }
        })
      }
    })
    .then(callback)
}

const App = () => (
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="about" component={About} />
      <Route path="dashboard" component={Dashboard} onEnter={requireAuth} />
    </Route>
  </Router>
)

export default App
