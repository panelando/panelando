import React, { Component } from 'react'
import R from 'ramda'
import { Grid, Row, Col } from 'react-flexbox-grid'
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

class SearchList extends Component {
  state = {
    isLoading: false,

    term: '',

    recipes: []
  }

  handleSignOut = () => {
    signOut().then(() => redirect('/login'))
  }

  seeRecipe = id => redirect(`/${id}`)

  componentWillMount () {
    const { term } = this.props.location.query
    this.setState({ term })
  }

  componentDidMount () {
    const reference = database().ref(`recipes`)
    const term = this.state.term

    return Promise.resolve()
      .then(() => this.setState({ isLoading: true }))
      .then(() => reference.once('value'))
      .then(snapshot => snapshot.val())
      .then(normalize)
      .then(R.filter(R.where({ tags: R.contains(term) })))
      .then(R.tap(console.log))
      .then(recipes => this.setState({ recipes }))
      .then(() => this.setState({ isLoading: false }))
  }

  render () {
    return (
      <Panel scrollY>
        <section>
          <AppBar>
            <IconButton icon="menu" inverse={true} onClick={this.props.onToggleDrawer} />
            <span>PESQUISA</span>

            <div className={styles.leftMenu}>
              <IconMenu position="topRight" className={styles.menuIcon}>
                <MenuItem value="signout" icon="exit_to_app" caption="Sign out" onClick={this.handleSignOut} />
              </IconMenu>
            </div>
          </AppBar>

          <Grid>
            <List selectable ripple>
              {(this.state.isLoading === false && this.state.recipes.length === 0) ? (
                <ListSubHeader caption="Nenhum resultado encontrado" />
              ) : (
                <ListSubHeader caption={`Procurando por: "${this.state.term}"`} />
              )}

              {this.state.recipes.map((recipe, recipeIndex) => (
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
            </List>

            <ProgressBar loading={this.state.isLoading} />
          </Grid>
        </section>
      </Panel>
    )
  }
}

export default SearchList

