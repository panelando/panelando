import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'

import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardMedia,
  CardText,
  CardTitle,
  IconButton,
  Panel,
  Tab,
  Tabs
} from 'react-toolbox'

import styles from './styles'

class List extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tabIndex: 0
    }
  }

  handleAddRecipeClick = () => alert('hey')
  handleTabChange = (tabIndex) => this.setState({ tabIndex })
  handleActive = () => console.log('Special one activated')

  render () {
    return (
      <Panel scrollY>
        <AppBar>
          <IconButton icon="menu" inverse={true} onClick={this.props.onToggleDrawer} />
          <span>RECEITAS</span>
        </AppBar>

        <section className={styles.section}>
          <Tabs index={this.state.tabIndex} onChange={this.handleTabChange} fixed inverse ripple>
            <Tab label="Descobrir">

              {[...Array(10)].map((x, i) => (
                <Card className={styles.recipe} key={i}>
                  <CardTitle
                    avatar="https://avatars2.githubusercontent.com/u/7416751?v=3&s=466"
                    title="Guilherme Coelho"
                    subtitle="Food artisan and disruptive entrepreneur"
                  />
                  <CardMedia
                    aspectRatio="wide"
                    image="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d8108430269011.561bad832d25f.jpg"
                  />
                  <CardTitle
                    title="Whiskey Glazed Flat Iron Steaks and Grilled Potatoes"
                    subtitle="Makes two portions"
                  />
                  <CardText>
                    <IconButton icon="alarm"primary/> <span>12h</span>
                  </CardText>
                  <CardActions>
                    <Button label="Action 1" />
                    <Button label="Action 2" />
                    <IconButton icon="favorite" />
                    <span>42</span>
                  </CardActions>
                </Card>
              ))}
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
