import React, { Component } from 'react'
import { Link } from 'react-router'
import { AuthEmitter, isLoggedIn } from '../lib/auth'

class Layout extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false
    }
  }

  componentWillMount () {
    AuthEmitter.on('auth-changed', ({ loggedIn }) => {
      this.setState({ loggedIn })
    })

    isLoggedIn()
      .then(loggedIn => this.setState({ loggedIn }))
  }

  render () {
    return (
      <div>
        <pre>
          {JSON.stringify(this.state)}
        </pre>
        <ul>
          <li>
            {this.state.loggedIn ? (
              <Link to="/logout" activeClassName="active">Log out</Link>
            ) : (
              <Link to="/login" activeClassName="active">Sign in</Link>
            )}
          </li>
          <li><Link to="/about" activeClassName="active">About</Link></li>
          <li><Link to="/dashboard" activeClassName="active">Dashboard</Link></li>
        </ul>

        {this.props.children || <p>You are {!this.state.loggedIn && 'not'} logged in.</p>}
      </div>
    )
  }
}

export default Layout
