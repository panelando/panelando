import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { login } from '../lib/auth'

import {
  AppBar,
  Button,
  Card,
  CardTitle,
  CardText,
  Input,
  Layout,
  NavBar,
  Panel
} from 'react-toolbox'

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      error: null,
      username: '',
      password: ''
    }
  }

  handleChange = (name, value) => {
    this.setState({ ...this.state, [name]: value})
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const { username, password } = this.state

    login({ username, password })
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
      <Layout>
        <Panel>
          <AppBar>LOGIN</AppBar>

          <Grid>
            <Row center="xs">
              <Col xs={12} sm={12} lg={6} >
                <Card style={{padding: '20px', margin: '80px 0 10px'}}>
                  <CardTitle>Login</CardTitle>
                  <CardText>
                    <form onSubmit={this.handleSubmit}>
                      <Input type="text" label="User" icon="face" value={this.state.username} onChange={this.handleChange.bind(this, 'username')} />
                      <Input type="password" label="Senha" icon="lock" value={this.state.password} onChange={this.handleChange.bind(this, 'password')} />
                      <Button type="submit" label="Login" primary raised />
                    </form>
                  </CardText>
                </Card>
              </Col>
            </Row>
          </Grid>
        </Panel>
      </Layout>
    )
  }
}

export default withRouter(Login)
