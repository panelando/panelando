import React, { Component } from 'react'
import { hashHistory, Router, Route, IndexRoute, Link, withRouter } from 'react-router'
import { isLoggedIn } from 'lib/auth'

import { ApplicationShell } from 'screens/layout'
import { Login, Logout } from 'screens/auth'
import { RecipeList, RecipeShow } from 'screens/recipes'

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
    <Route path="login" component={Login} />

    <Route path="/" component={ApplicationShell} onEnter={requireAuth} >
      <IndexRoute component={RecipeList} />
      <Route path="/:id" component={RecipeShow} />
      <Route path="logout" component={Logout} />
    </Route>
  </Router>
)

export default App
