import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { signInWithGoogle, signInWithFacebook } from 'lib/auth'

import {
  Button,
  Layout,
  NavBar,
  Panel
} from 'react-toolbox'

import styles from './styles'

class Login extends Component {
  googleLogin = () => {
    signInWithGoogle()
      .then(this.redirectAfterLogin)
      .catch(err => console.error(`Sign-in Error: ${err}`))
  }

  facebookLogin = () => {
    signInWithFacebook()
      .then(this.redirectAfterLogin)
      .catch(err => console.error(`Sign-in Error: ${err}`))
  }

  redirectAfterLogin = () => {
    const { location } = this.props

    if (location.state && location.state.nextPathname) {
      return this.props.router.replace(location.state.nextPathname)
    }

    return this.props.router.replace('/')
  }

  render () {
    return (
      <Layout>
        <Panel className={styles.panel}>
          <div className={styles.container}>
            <div className={styles.logo}>
              <img src="http://emojipedia-us.s3.amazonaws.com/cache/d5/6d/d56d6855c382a1de6e926882cce931f0.png" />
            </div>

            <div className={styles.header}>Panelando</div>
            <div className={styles.subHeader}>Cozinhe aqui suas ideias</div>

            <div className={styles.buttons}>
              <Button className={styles.google} label="Login com Google" raised primary onClick={this.googleLogin} />
              <Button className={styles.facebook} label="Login com Facebook" raised primary onClick={this.facebookLogin} />
            </div>
          </div>

          <footer className={styles.footer}>
            Copyright © 2016 Panelando
          </footer>
        </Panel>
      </Layout>
    )
  }
}

export default withRouter(Login)
