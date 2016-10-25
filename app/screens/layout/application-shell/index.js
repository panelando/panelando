import React, { Component } from 'react'
import { Link } from 'react-router'
import { AuthEmitter, isLoggedIn, getToken } from 'lib/auth'
import {
  Avatar,
  FontIcon,
  Layout,
  List,
  ListItem,
  NavDrawer
} from 'react-toolbox'

import styles from './styles'

class ApplicationShell extends Component {
  constructor (props) {
    super(props)

    this.state = {
      drawerActive: false,
      loggedIn: false,
      token: null
    }
  }

  toggleDrawerActive = () => {
    this.setState({ drawerActive: !this.state.drawerActive })
  }

  childrenWithProps = () => {
    const propsToPassToChildren = {
      onToggleDrawer: this.toggleDrawerActive
    }

    return React.cloneElement(this.props.children, propsToPassToChildren)
  }

  componentWillMount () {
    AuthEmitter.on('auth-changed', ({ loggedIn }) => this.setState({ loggedIn }))
  }

  componentDidMount () {
    isLoggedIn()
      .then(loggedIn => this.setState({ loggedIn }))
      .then(getToken)
      .then(token => this.setState({ token }))
  }

  render() {
    return (
      <Layout>
        <NavDrawer className={styles.drawer} active={this.state.drawerActive}
          permanentAt='xxxl'
          onOverlayClick={this.toggleDrawerActive}>

          <div className={styles.drawerHeaderContainer}>
            <div className={styles.drawerHeader}>
              <Avatar className={styles.drawerUserAvatar}>
                <img src="https://avatars2.githubusercontent.com/u/7416751?v=3&s=466" />
              </Avatar>

              <div className={styles.drawerUserName}>
                Guilherme Coelho
              </div>

              <div className={styles.drawerUserLocation}>
                <FontIcon value="room" />
                <span>Jundiaí, Brazil</span>
              </div>
            </div>
          </div>

          <List className={styles.drawerMenu} selectable ripple>
            <ListItem caption="Início" leftIcon="home" />
            <ListItem caption="Receitas" leftIcon="restaurant" />
            <ListItem caption="Menus" leftIcon="star" />
            <ListItem caption="Likes" leftIcon="favorite" />
          </List>
        </NavDrawer>

        {this.childrenWithProps()}
      </Layout>
    )
  }
}

export default ApplicationShell
