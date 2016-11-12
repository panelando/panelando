import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'
import { signOut, redirect } from 'lib/auth'

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

import styles from './styles'

class List extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tabIndex: 0
    }
  }

  handleSignOut = () => {
    signOut().then(() => redirect('/login'))
  }

  handleTabChange = tabIndex => {
    this.setState({ tabIndex })
  }

  seeRecipe = id => () => {
    redirect(`/${id}`)
  }

  addRecipe = () => {
    redirect('/new')
  }

  render () {
    return (
      <Panel scrollY>
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

          <Tabs index={this.state.tabIndex} onChange={this.handleTabChange} fixed inverse>
            <Tab label="Descobrir">
              {[...Array(10)].map((x, recipeId) => (
                <Card className={styles.recipe} key={recipeId}>
                  <CardMedia
                    aspectRatio="wide"
                    image="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d8108430269011.561bad832d25f.jpg"
                    onClick={this.seeRecipe(recipeId)}
                  />

                  <CardTitle
                    title="Whiskey Glazed Flat Iron Steaks and Grilled Potatoes"
                    onClick={this.seeRecipe(recipeId)}
                  />

                  <CardText className={styles.recipeInfo}>
                    <div>
                      <IconButton><TimeIcon /></IconButton>
                      <span>60 min</span>
                    </div>

                    <div>
                      <IconButton><PortionIcon /></IconButton>
                      <span>3 porções</span>
                    </div>

                    <div>
                      <IconButton><DifficultyIcon /></IconButton>
                      <span>Muito Difícil</span>
                    </div>
                  </CardText>

                  <CardTitle
                    avatar="https://avatars2.githubusercontent.com/u/7416751?v=3&s=466"
                    title="Guilherme Coelho"
                    subtitle="Food artisan and disruptive entrepreneur"
                    style={{ borderTop: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5' }}
                  />

                  <CardActions>
                    <IconButton icon="favorite" />
                    <span>42</span>
                  </CardActions>
                </Card>
              ))}

              <Button icon="add" floating accent className={styles.addButton} onClick={this.addRecipe} />
            </Tab>

            <Tab label="Populares">
              <small>Populares</small>
            </Tab>

            <Tab label="Novidades">
              <small>Novidades</small>
            </Tab>
          </Tabs>
        </section>
      </Panel>
    )
  }
}

export default List
