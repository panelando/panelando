import React, { Component } from 'react'
import R from 'ramda'
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'
import { signOut, redirect } from 'lib/auth'
import { database, normalize, auth } from 'lib/firebase'
import { MenuDialog } from 'components'

import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardMedia,
  CardText,
  CardTitle,
  IconButton,
  IconMenu,
  MenuDivider,
  MenuItem,
  List,
  ListItem,
  ListDivider,
  ListSubHeader,
  Panel
} from 'react-toolbox'

import {
  DifficultyIcon,
  IngredientIcon,
  PortionIcon,
  StepIcon,
  TimeIcon
} from 'components/icons'

import { DropdownItem, ProgressBar } from 'components'

import styles from './styles'

class MenuList extends Component {
  state = {
    isLoading: false,

    menus: []
  }

  handleSignOut = () => {
    signOut().then(() => redirect('/login'))
  }

  seeRecipe = id => redirect(`/${id}`)

  componentDidMount () {
    const uid = auth().currentUser.uid
    const reference = database().ref(`menus/${uid}`)

    return Promise.resolve()
      .then(() => this.setState({ isLoading: true }))
      .then(() => reference.once('value'))
      .then(snapshot => snapshot.val())
      .then(R.tap(console.log))
      .then(normalize)
      .then(menus => this.setState({ menus }))
      .then(() => this.setState({ isLoading: false }))
  }

  render () {
    return (
      <Panel scrollY>
        <section>
          <AppBar>
            <IconButton icon="menu" inverse={true} onClick={this.props.onToggleDrawer} />
            <span>MENUS</span>

            <div className={styles.leftMenu}>
              <IconMenu position="topRight" className={styles.menuIcon}>
                <MenuItem value="signout" icon="exit_to_app" caption="Sign out" onClick={this.handleSignOut} />
              </IconMenu>
            </div>
          </AppBar>

          <Grid>
            <ProgressBar loading={this.state.isLoading} />

            <List selectable ripple>
              {this.state.menus.map((menu, index) => (
                <div key={`${menu.name}${index}`}>
                  <ListSubHeader caption={menu.name} />

                  {menu.recipes.map((recipe, recipeIndex) => (
                    <ListItem
                      onClick={() => this.seeRecipe(recipe.id)}
                      key={`${recipe.name}${recipe.id}`}
                    >
                      <DropdownItem
                        image={recipe.image}
                        name={recipe.title}
                        description={`Por ${recipe.user.displayName}`}
                      />
                    </ListItem>
                  ))}

                  {index !== this.state.menus.length - 1 && (
                    <ListDivider />
                  )}
                </div>
              ))}
            </List>
          </Grid>
        </section>
      </Panel>
    )
  }
}

export default MenuList
