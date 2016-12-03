import React, { Component } from 'react'
import { Link } from 'react-router'

import {
  Avatar,
  FontIcon,
  Layout,
  List,
  ListItem,
  NavDrawer
} from 'react-toolbox'

import { auth } from 'lib/firebase'

import styles from './styles'

class ApplicationShell extends Component {
  constructor (props) {
    super(props)

    this.state = {
      drawerActive: false,
      user: {
        displayName: '',
        photoURL: ''
      }
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

  componentDidMount () {
    return Promise.resolve()
      .then(() => auth().currentUser)
      .then(user => this.setState({ user  }))
  }

  render () {
    return (
      <Layout>
        <NavDrawer className={styles.drawer} active={this.state.drawerActive}
          permanentAt='xxxl'
          onOverlayClick={this.toggleDrawerActive}>

          <div className={styles.drawerHeaderContainer}>
            <div className={styles.drawerHeader}>
              <Avatar className={styles.drawerUserAvatar}>
                <img src={this.state.user.photoURL} />
              </Avatar>

              <div className={styles.drawerUserName}>
                {this.state.user.displayName}
              </div>

              <div className={styles.drawerUserLocation}>
                <FontIcon value="room" />
                <span>Jundiaí, Brazil</span>
              </div>
            </div>
          </div>

          <List className={styles.drawerMenu} selectable ripple>
            <Link to="/"><ListItem caption="Receitas" leftIcon="restaurant_menu" /></Link>
            <Link to="/menus"><ListItem caption="Menus" leftIcon="bookmark_border" /></Link>
            <Link to={{ pathname: '/', query: { tab: 'popular' } }} ><ListItem caption="Populares" leftIcon="whatshot" /></Link>
            <Link to={{ pathname: '/', query: { tab: 'favorites' } }} ><ListItem caption="Favoritos" leftIcon="favorite_border" /></Link>
          </List>
        </NavDrawer>

        {this.childrenWithProps()}
      </Layout>
    )
  }
}

export default ApplicationShell
