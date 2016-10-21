import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { login } from '../lib/auth'

class Login extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      error: null
    }
  }

  handleSubmit (event) {
    event.preventDefault()

    const email = this.refs.email.value
    const password = this.refs.password.value

    login({ email, password })
      .then(() => {
        const { location } = this.props

        if (location.state && location.state.nextPathname) {
          return this.props.router.replace(location.state.nextPathname)
        }

        return this.props.router.replace('/')
      })
      .catch(err => this.setState({ error: err.message }))
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input ref="email" placeholder="email" defaultValue="gui" />
        <input ref="password" type="password" defaultValue="xundas" />
        <button type="submit">Sign in</button>

        {this.state.error && (
          <p>{this.state.error}</p>
        )}
      </form>
    )
  }
}

export default withRouter(Login)
