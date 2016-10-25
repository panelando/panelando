import React, { Component } from 'react'
import { logout } from 'lib/auth'

class Logout extends Component {
  componentDidMount () {
    logout()
  }

  render () {
    return <p>You are now logged out</p>
  }
}


export default Logout
