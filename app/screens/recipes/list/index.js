import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'
import { logout, redirect } from 'lib/auth'

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

import styles from './styles'

const DifficultyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M 8 2 C 7.4 2 6.80625 2.3125 6.40625 2.8125 L 3 7 L 3 10 C 3 11.1 3.9 12 5 12 L 16 12 L 16 14.15625 C 14.280158 14.603316 13 16.146802 13 18 C 13 20.197294 14.802706 22 17 22 C 19.197294 22 21 20.197294 21 18 C 21 16.146802 19.719842 14.603316 18 14.15625 L 18 12 L 19 12 C 20.1 12 21 11.1 21 10 L 21 7 L 18.59375 3 C 18.19375 2.4 17.60625 2 16.90625 2 L 8 2 z M 8 4 L 16.90625 4 L 19 7.59375 L 19 10 L 5 10 L 5 7.6875 L 8 4 z M 9 5 L 9 7 L 16 7 L 16 5 L 9 5 z M 16 16.28125 L 16 19.71875 C 15.403058 19.375351 15 18.747535 15 18 C 15 17.252465 15.403058 16.624649 16 16.28125 z M 18 16.28125 C 18.596942 16.624649 19 17.252465 19 18 C 19 18.747535 18.596942 19.375351 18 19.71875 L 18 16.28125 z" color="#000" overflow="visible"></path>
  </svg>
)

const TimeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M 6.65625 1.3125 C 4.3359587 2.4174006 2.4174006 4.3359587 1.3125 6.65625 L 3.0625 7.53125 C 2.393357 8.8741945 2 10.394345 2 12 C 2 17.533333 6.4666667 22 12 22 C 17.533333 22 22 17.533333 22 12 C 22 10.394345 21.606643 8.8741945 20.9375 7.53125 L 22.6875 6.65625 C 21.582599 4.3359587 19.664041 2.4174006 17.34375 1.3125 L 16.46875 3.0625 C 15.125805 2.393357 13.605655 2 12 2 C 10.394345 2 8.8741945 2.393357 7.53125 3.0625 L 6.65625 1.3125 z M 12 4 C 16.466667 4 20 7.5333333 20 12 C 20 16.466667 16.466667 20 12 20 C 7.5333333 20 4 16.466667 4 12 C 4 7.5333333 7.5333333 4 12 4 z M 11 7 L 11 12 L 11 12.40625 L 11.28125 12.71875 L 14.28125 15.71875 L 15.71875 14.28125 L 13 11.5625 L 13 7 L 11 7 z" color="#000" overflow="visible"></path>
  </svg>
)

const PortionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M 18.0625 1.84375 C 17.544092 1.9204785 17.078125 2.266875 16.84375 2.78125 L 14 8.40625 C 14.219 8.37225 14.4365 8.358 14.6875 8.375 C 15.0155 8.397 15.7115 8.49925 16.3125 8.90625 L 19.625 4.34375 C 20.169 3.54175 19.869 2.43 19 2 C 18.69625 1.84925 18.373545 1.7977129 18.0625 1.84375 z M 10.09375 8.21875 C 8.62775 8.21875 7.62075 9.17475 7.34375 9.46875 C 7.13375 9.69175 6.94725 9.914 6.78125 10.125 C 6.77825 10.123 6.753 10.127 6.75 10.125 C 5.862 9.561 4.53325 9.559 3.53125 10.125 C 2.57425 10.666 2.006 11.735 2 13 L 2 16 C 2 19.302 4.698 22 8 22 L 16 22 C 19.302 22 22 19.302 22 16 L 22 12.84375 C 21.981 12.71875 21.77025 11.59475 21.03125 10.71875 C 20.73925 10.37375 19.98925 9.46875 18.78125 9.46875 C 17.94525 9.47675 17.12575 9.955 16.71875 10.25 C 16.05375 9.535 15.0975 9.403 14.6875 9.375 C 13.9555 9.327 13.329 9.56575 13 9.71875 C 12.956 9.66075 12.915 9.58725 12.875 9.53125 C 12.007 8.33625 10.45425 8.22675 10.28125 8.21875 L 10.09375 8.21875 z M 10.40625 10.1875 C 11.650342 10.232874 12.40625 12.1875 12.40625 12.1875 C 12.40625 12.1875 13.5435 11.299 14.5625 11.375 C 15.8475 11.471 16.59375 13.09375 16.59375 13.09375 C 16.59375 13.09375 17.36625 11.40075 18.78125 11.46875 C 19.75525 11.51575 19.955 12.87275 20 13.09375 L 20 14 L 4 14 L 4 12.96875 C 4.001 12.72175 4.04125 12.1 4.53125 11.875 C 5.94525 11.224 7.15625 13.15625 7.15625 13.15625 C 7.15625 13.15625 8.24325 10.40775 10.15625 10.21875 C 10.2435 10.203875 10.323311 10.184475 10.40625 10.1875 z"></path>
  </svg>
)

class List extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tabIndex: 0
    }
  }

  handleLogout = () => logout().then(() => redirect('/login'))
  handleAddButton = () => alert('hey')
  handleTabChange = (tabIndex) => this.setState({ tabIndex })
  handleActive = () => console.log('Special one activated')
  favorite = () => console.log('Favorited')

  goToRecipe = id => () => redirect(`/${id}`)

  render () {
    return (
      <Panel scrollY>
        <section>
          <AppBar>
            <IconButton icon="menu" inverse={true} onClick={this.props.onToggleDrawer} />
            <span>RECEITAS</span>


            <div className={styles.leftMenu}>
              <IconMenu position="topRight" className={styles.menuIcon}>
                <MenuItem value="signout" icon="exit_to_app" caption="Sign out" onClick={this.handleLogout} />
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
                    onClick={this.goToRecipe(recipeId)}
                  />

                  <CardTitle
                    title="Whiskey Glazed Flat Iron Steaks and Grilled Potatoes"
                    onClick={this.goToRecipe(recipeId)}
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
                    <IconButton icon="favorite" onClick={this.favorite} />
                    <span>42</span>
                  </CardActions>
                </Card>
              ))}

              <Button icon="add" floating accent className={styles.addButton} onClick={this.handleAddButton} />
            </Tab>

            <Tab label="Populares">
              <small>Populares</small>
            </Tab>

            <Tab label="Novidades" onActive={this.handleActive}>
              <small>Novidades</small>
            </Tab>
          </Tabs>
        </section>

      </Panel>
    )
  }
}

export default List
