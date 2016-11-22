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

import { RecipeCard } from 'components'

import styles from './styles'

class List extends Component {
  state = {
    tabs: {
      tabIndex: 0
    },

    dialog: {
      active: false,
      recipeId: null
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

  addRecipeToMenu = id => {
    this.setState({
      dialog: {
        active: true,
        recipeId: id
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
        this.setState({ recipes })

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
        this.setState({ recipes })
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

  componentDidMount () {
    const uid = auth().currentUser.uid

    database()
      .ref('recipes')
      .once('value')
      .then(snapshot => snapshot.val())
      .then(normalize)
      .then(R.tap(
        recipes => this.setState({ recipes })
      ))
      .then(R.map(R.path(['likes', 'length'])))
      .then(console.info)
  }

  render () {
    return (
      <Panel scrollY>
        <MenuDialog
          active={this.state.dialog.active}
          recipeId={this.state.dialog.recipeId}
          onDialogToggle={this.handleDialogToggle}
          onBookmark={this.bookmarkRecipe}
          onFavorite={this.favoriteRecipe}
          onUnfavorite={this.unFavoriteRecipe}
        />

        <section>
          <AppBar>
            <IconButton icon="menu" inverse={true} onClick={this.props.onToggleDrawer} />
            <span>RECEITAS</span>

            <div className={styles.leftMenu}>
              <IconMenu position="topRight" className={styles.menuIcon}>
                <MenuItem value="signout" icon="exit_to_app" caption="Sign out" onClick={this.handleSignOut} />
              </IconMenu>
            </div>
          </AppBar>

          <Tabs index={this.state.tabs.tabIndex} onChange={this.handleTabChange} fixed inverse>
            <Tab label="Descobrir">
              {this.state.recipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  canFavorite={this.canFavoriteRecipe(recipe.id)}
                  onSeeDetails={this.seeRecipe}
                  onFavorite={this.favoriteRecipe}
                  onUnfavorite={this.unfavoriteRecipe}
                  onBookmark={() => this.addRecipeToMenu(recipe.id)}
                />
              ))}

              <Button icon="add" floating accent className={styles.addButton} onClick={this.newRecipe} />
            </Tab>

            <Tab label="Populares">
              {this.getPopularRecipes(this.state.recipes).map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  canFavorite={this.canFavoriteRecipe(recipe.id)}
                  onSeeDetails={this.seeRecipe}
                  onFavorite={this.favoriteRecipe}
                  onUnfavorite={this.unfavoriteRecipe}
                  onBookmark={() => this.addRecipeToMenu(recipe.id)}
                />
              ))}

              <Button icon="add" floating accent className={styles.addButton} onClick={this.newRecipe} />
            </Tab>

            <Tab label="Favoritos">
              {this.getFavoriteRecipes(this.state.recipes).map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  canFavorite={this.canFavoriteRecipe(recipe.id)}
                  onSeeDetails={this.seeRecipe}
                  onFavorite={this.favoriteRecipe}
                  onUnfavorite={this.unfavoriteRecipe}
                  onBookmark={() => this.addRecipeToMenu(recipe.id)}
                />
              ))}

              <Button icon="add" floating accent className={styles.addButton} onClick={this.newRecipe} />
            </Tab>
          </Tabs>
        </section>
      </Panel>
    )
  }
}

export default List
