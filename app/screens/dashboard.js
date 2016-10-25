import React, { Component } from 'react'
import { getToken } from 'lib/auth'

class Dashboard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      token: null
    }
  }

  componentDidMount () {
    getToken()
      .then(token => this.setState({ token }))
  }

  render () {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>You made it!</p>
        <p>Token: {this.state.token}</p>
      </div>
    )
  }
}

export default Dashboard
