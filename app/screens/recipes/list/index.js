import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import R from 'ramda'
import qs from 'qs'
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
  Panel,
  Tab,
  Tabs
} from 'react-toolbox'

import {
  DifficultyIcon,
  IngredientIcon,
  PortionIcon,
  StepIcon,
  TimeIcon
} from 'components/icons'

import { ProgressBar, RecipeCard } from 'components'

import styles from './styles'

class List extends Component {
  state = {
    isLoading: false,

    search: {
      active: false
    },

    tabs: {
      tabIndex: 0
    },

    dialog: {
      active: false,
      recipe: null
    },

    recipes: [],
    popularRecipes: [],
    favoriteRecipes: []
  }

  handleSignOut = () => {
    signOut().then(() => redirect('/login'))
  }

  handleTabChange = tabIndex => {
    this.setState({
      tabs: { tabIndex }
    })
  }

  handleDialogToggle = () => {
    this.setState({
      dialog: {
        active: !this.state.dialog.active
      }
    })
  }

  seeRecipe = id => {
    redirect(`/${id}`)
  }

  addRecipeToMenu = recipe => {
    this.setState({
      dialog: {
        recipe,
        active: true
      }
    })
  }

  canFavoriteRecipe = id => {
    const uid = auth().currentUser.uid
    const recipe = R.find(R.propEq('id', id), this.state.recipes)
    const getLikes = R.compose(R.defaultTo([]), R.prop('likes'))
    const likes = getLikes(recipe)

    return R.not(R.contains(uid, likes))
  }

  favoriteRecipe = id => {
    const reference = database().ref(`recipes/${id}/likes`)
    const recipeIndex = R.findIndex(R.propEq('id', id), this.state.recipes)
    const uid = auth().currentUser.uid

    reference
      .once('value')
      .then(R.invoker(0, 'val'))
      .then(R.defaultTo([]))
      .then(R.cond([
        [R.contains(uid), R.identity],
        [R.T, R.append(uid)]
      ]))
      .then(likes => {
        const recipe = R.merge(R.nth(recipeIndex, this.state.recipes), { likes })
        const recipes = R.update(recipeIndex, recipe, this.state.recipes)

        reference.set(likes)
        this.updateRecipes(recipes)
      })
  }

  unfavoriteRecipe = id => {
    const reference = database().ref(`recipes/${id}/likes`)
    const recipeIndex = R.findIndex(R.propEq('id', id), this.state.recipes)
    const uid = auth().currentUser.uid

    reference
      .once('value')
      .then(R.invoker(0, 'val'))
      .then(R.defaultTo([]))
      .then(uids => R.cond([
          [R.contains(uid), R.remove(R.indexOf(uid, uids), 1)],
          [R.T, R.identity]
        ])(uids)
      )
      .then(likes => {
        const recipe = R.merge(R.nth(recipeIndex, this.state.recipes), { likes })
        const recipes = R.update(recipeIndex, recipe, this.state.recipes)

        reference.set(likes)
        this.updateRecipes(recipes)
      })
  }

  newRecipe = () => {
    redirect('/new')
  }

  getPopularRecipes = R.compose(
    R.reverse,
    R.sortBy(
      R.compose(
        R.length,
        R.defaultTo([]),
        R.prop('likes')
      )
    )
  )

  getFavoriteRecipes = recipes => {
    const uid = auth().currentUser.uid

    return R.filter(
      R.compose(R.contains(uid), R.defaultTo([]), R.prop('likes'))
    )(recipes)
  }

  updateRecipes = recipes => {
    const popularRecipes = this.getPopularRecipes(recipes)
    const favoriteRecipes = this.getFavoriteRecipes(recipes)

    this.setState({ recipes, popularRecipes, favoriteRecipes })
  }

  openSearch = () => {
    this.setState({
      search: { active: true }
    })
  }

  closeSearch = () => {
    this.setState({
      search: { active: false }
    })
  }

  submitSearch = event => {
    if (event.keyCode === 13) {
      const value = event.target.value.toLowerCase()

      const query = qs.stringify({
        term: value
      })

      const url = `/search?${query}`

      redirect(url)
    }
  }

  componentWillMount () {
    const { tab } = this.props.location.query

    const getTabIndex = R.cond([
      [R.equals('discover'), R.always(0)],
      [R.equals('popular'), R.always(1)],
      [R.equals('favorites'), R.always(2)],
      [R.T, R.always(0)]
    ], tab)

    const tabIndex = getTabIndex(tab)

    this.handleTabChange(tabIndex)
  }

  componentDidMount () {
    const uid = auth().currentUser.uid
    const reference = database().ref('recipes')

    return Promise.resolve()
      .then(() => this.setState({ isLoading: true }))
      .then(() => reference.once('value'))
      .then(snapshot => snapshot.val())
      .then(normalize)
      .then(R.reverse)
      .then(this.updateRecipes)
      .then(() => this.setState({ isLoading: false }))
  }

  render () {
    return (
      <Panel scrollY>
        <MenuDialog
          active={this.state.dialog.active}
          recipe={this.state.dialog.recipe}
          onDialogToggle={this.handleDialogToggle}
          onBookmark={this.bookmarkRecipe}
          onFavorite={this.favoriteRecipe}
          onUnfavorite={this.unFavoriteRecipe}
        />

        <section>
          {this.state.search.active ? (
            <AppBar className={styles.searchNavbar}>
              <input
                ref="searchInput"
                autoFocus
                onKeyDown={this.submitSearch}
              />

              <div className={styles.leftMenu}>
                <IconButton icon="close" className={styles.closeIcon} onClick={this.closeSearch} />
              </div>
            </AppBar>
          ) : (
            <AppBar>
              <IconButton icon="menu" inverse={true} onClick={this.props.onToggleDrawer} />
              <span>RECEITAS</span>

              <div className={styles.leftMenu}>
                <IconButton icon="search" className={styles.searchIcon} onClick={this.openSearch} />

                <IconMenu position="topRight" className={styles.menuIcon}>
                  <MenuItem value="signout" icon="exit_to_app" caption="Sign out" onClick={this.handleSignOut} />
                </IconMenu>
              </div>
            </AppBar>
          )}

          <Tabs index={this.state.tabs.tabIndex} onChange={this.handleTabChange} fixed inverse>
            <Tab label="Descobrir">
              <ProgressBar loading={this.state.isLoading} />

              <Row>
                {this.state.recipes.map(recipe => (
                  <Col xs={12} sm={6} md={6} lg={4} key={recipe.id}>
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      canFavorite={this.canFavoriteRecipe(recipe.id)}
                      onSeeDetails={this.seeRecipe}
                      onFavorite={this.favoriteRecipe}
                      onUnfavorite={this.unfavoriteRecipe}
                      onBookmark={() => this.addRecipeToMenu(recipe)}
                    />
                  </Col>
                ))}
              </Row>

              <Button icon="add" floating accent className={styles.addButton} onClick={this.newRecipe} />
            </Tab>

            <Tab label="Populares">
              <ProgressBar loading={this.state.isLoading} />

              <Row>
                {this.state.popularRecipes.map(recipe => (
                  <Col xs={12} sm={6} md={6} lg={4} key={recipe.id}>
                    <RecipeCard
                      recipe={recipe}
                      canFavorite={this.canFavoriteRecipe(recipe.id)}
                      onSeeDetails={this.seeRecipe}
                      onFavorite={this.favoriteRecipe}
                      onUnfavorite={this.unfavoriteRecipe}
                      onBookmark={() => this.addRecipeToMenu(recipe)}
                    />
                  </Col>
                ))}
              </Row>

              <Button icon="add" floating accent className={styles.addButton} onClick={this.newRecipe} />
            </Tab>

            <Tab label="Favoritos">
              <ProgressBar loading={this.state.isLoading} />

              <Row>
                {this.state.favoriteRecipes.map(recipe => (
                  <Col xs={12} sm={6} md={6} lg={4} key={recipe.id}>
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      canFavorite={this.canFavoriteRecipe(recipe.id)}
                      onSeeDetails={this.seeRecipe}
                      onFavorite={this.favoriteRecipe}
                      onUnfavorite={this.unfavoriteRecipe}
                      onBookmark={() => this.addRecipeToMenu(recipe)}
                    />
                  </Col>
                ))}
              </Row>

              <Button icon="add" floating accent className={styles.addButton} onClick={this.newRecipe} />
            </Tab>
          </Tabs>
        </section>
      </Panel>
    )
  }
}

export default List
