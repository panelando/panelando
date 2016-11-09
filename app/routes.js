import React, { Component } from 'react'
import { hashHistory, Router, Route, IndexRoute, Link, withRouter } from 'react-router'
import { auth } from 'lib/firebase'

import { ApplicationShell } from 'screens/layout'
import { Login } from 'screens/auth'
import { RecipeList, RecipeShow, RecipeNew } from 'screens/recipes'

const requireAuth = (nextState, replace, callback) => {
  auth().onAuthStateChanged(user => {
    if (!user) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    }

    callback()
  })
}

const App = () => (
  <Router history={hashHistory}>
    <Route path="login" component={Login} />

    <Route path="/" component={ApplicationShell} onEnter={requireAuth} >
      <IndexRoute component={RecipeList} />
      <Route path="/new" component={RecipeNew} />
      <Route path="/:id" component={RecipeShow} />
    </Route>
  </Router>
)

export default App
