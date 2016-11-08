import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { auth } from 'lib/firebase'

import {
  Button,
  Layout,
  NavBar,
  Panel
} from 'react-toolbox'

import styles from './styles'

class Login extends Component {
  signInWithGoogle = () => {
    const provider = new auth.GoogleAuthProvider()

    provider.addScope('https://www.googleapis.com/auth/userinfo.profile')

    auth().signInWithPopup(provider)
      .then(result => console.info(result))
      .catch(err => console.error(err))
  }

  signInWithFacebook = () => {
    const provider = new auth.FacebookAuthProvider()

    auth().signInWithPopup(provider)
      .then(result => console.info(result))
      .catch(err => console.error(err))
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
              <Button className={styles.google} label="Login com Google" raised primary onClick={this.signInWithGoogle} />
              <Button className={styles.facebook} label="Login com Facebook" raised primary onClick={this.signInWithFacebook} />
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
