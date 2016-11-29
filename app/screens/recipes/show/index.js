import React, { Component } from 'react'
import R from 'ramda'
import { withRouter } from 'react-router'
import { auth, database, normalize } from 'lib/firebase'

import {
  AppBar,
  Avatar,
  Button,
  Card,
  CardActions,
  CardMedia,
  CardText,
  CardTitle,
  Chip,
  IconButton,
  Input,
  List,
  ListCheckbox,
  ListDivider,
  ListItem,
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

import { MenuDialog, ProgressBar } from 'components'

import styles from './styles'

class Show extends Component {
  state = {
    comment: '',

    recipe: {
      title: '',
      ingredients: [],
      comments: [],
      steps: [],
      tags: [],
      user: {}
    },

    isLoading: true,

    dialog: {
      active: false,
      recipe: null
    }
  }

  trim = (str, quantity = 30) => {
    return str.substring(0, quantity)
  }

  handleCommentChange = comment => {
    this.setState({ comment })
  }

  submitComment = () => {
    const id = this.props.params.id
    const user = auth().currentUser

    const text = this.state.comment
    const { displayName, photoURL } = user

    const reference = database().ref(`recipes/${id}/comments`)

    reference
      .once('value')
      .then(R.invoker(0, 'val'))
      .then(R.defaultTo([]))
      .then(R.append({
        text,
        displayName,
        photoURL
      }))
      .then(comments => {
        const recipe = R.merge(this.state.recipe, { comments })

        reference.set(comments)
        this.setState({ recipe })
        this.setState({ comment: '' })
      })
  }

  handleDialogToggle = () => {
    this.setState({
      dialog: {
        active: !this.state.dialog.active
      }
    })
  }

  addRecipeToMenu = recipe => {
    this.setState({
      dialog: {
        recipe,
        active: true,
      }
    })
  }

  canFavoriteRecipe = id => {
    const uid = auth().currentUser.uid
    const recipe = this.state.recipe
    const getLikes = R.compose(R.defaultTo([]), R.prop('likes'))
    const likes = getLikes(recipe)

    return R.not(R.contains(uid, likes))
  }

  favoriteRecipe = id => {
    const uid = auth().currentUser.uid
    const reference = database().ref(`recipes/${id}/likes`)

    reference
      .once('value')
      .then(R.invoker(0, 'val'))
      .then(R.defaultTo([]))
      .then(R.cond([
        [R.contains(uid), R.identity],
        [R.T, R.append(uid)]
      ]))
      .then(likes => {
        const recipe = R.merge(this.state.recipe, { likes })

        reference.set(likes)
        this.setState({ recipe })
      })
  }

  unfavoriteRecipe = id => {
    const reference = database().ref(`recipes/${id}/likes`)
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
        const recipe = R.merge(this.state.recipe, { likes })

        reference.set(likes)
        this.setState({ recipe })
      })
  }


  componentDidMount () {
    const id = this.props.params.id
    const reference = database().ref('recipes').child(id)

    return Promise.resolve()
      .then(() => this.setState({ isLoading: true }))
      .then(() => reference.once('value'))
      .then(R.invoker(0, 'val'))
      .then(R.merge({
        id,
        comments: [],
        likes: []
      }))
      .then(recipe => this.setState({ recipe }))
      .then(() => this.setState({ isLoading: false }))
  }

  render () {
      return (
        <Panel scrollY>
          <MenuDialog
            active={this.state.dialog.active}
           recipe={this.state.dialog.recipe}
            onDialogToggle={this.handleDialogToggle}
          />

          <section>
            <AppBar>
              <IconButton icon="arrow_back" inverse={true} onClick={this.props.router.goBack} />
              <span>{this.trim(this.state.recipe.title)}</span>
            </AppBar>

            <ProgressBar loading={this.state.isLoading} />

            <Card style={{ opacity: this.state.isLoading ? 0 : 1 }}>
              <CardMedia
                aspectRatio="wide"
                image={this.state.recipe.image}
              />

              <CardTitle
                title={this.state.recipe.title}
              />

              <CardText className={styles.recipeInfo}>
                <div>
                  <IconButton><TimeIcon /></IconButton>
                  <span>{this.state.recipe.time} min</span>
                </div>

                <div>
                  <IconButton><PortionIcon /></IconButton>
                  <span>{this.state.recipe.portion} porções</span>
                </div>

                <div>
                  <IconButton><DifficultyIcon /></IconButton>
                  <span>{this.state.recipe.difficulty}</span>
                </div>
              </CardText>

              <CardTitle
                avatar={this.state.recipe.user.photoURL}
                title={this.state.recipe.user.displayName}
                subtitle="Food artisan and disruptive entrepreneur"
                style={{ borderTop: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5' }}
              />

              <CardActions style={{ borderBottom: '1px solid #f5f5f5' }}>
                <IconButton icon="bookmark_border" onClick={() => this.addRecipeToMenu(this.state.recipe)} />

                {this.canFavoriteRecipe(this.props.params.id) ? (
                  <IconButton className={styles.favorite} icon="favorite_border" onClick={() => this.favoriteRecipe(this.props.params.id)}/>
                ) : (
                  <IconButton className={styles.favorite} icon="favorite" onClick={() => this.unfavoriteRecipe(this.props.params.id)}/>
                )}

                <span>{this.state.recipe.likes ? this.state.recipe.likes.length : 0}</span>
              </CardActions>

              <List selectable ripple>
                <ListSubHeader caption="Ingredientes" />

                {this.state.recipe.ingredients.map((ingredient, index) => (
                  <ListItem caption={ingredient} key={`${ingredient}${index}`}>
                    <IconButton><IngredientIcon /></IconButton>
                  </ListItem>
                ))}

                <ListDivider />

                <ListSubHeader caption="Modo de Preparo" />

                {this.state.recipe.steps.map((step, index) => (
                  <ListItem className={styles.step} caption={step} key={`${step}${index}`}>
                    <IconButton><StepIcon /></IconButton>
                  </ListItem>
                ))}

                <ListDivider />

                <ListSubHeader caption="Tags" />

                <ListItem className={styles.tags}>
                  {this.state.recipe.tags.map((tag, index) => (
                    <Chip key={`${tag}${index}`}>{tag}</Chip>
                  ))}
                </ListItem>

                <ListDivider />

                <ListSubHeader caption="Comentários" />

                {this.state.recipe.comments.map((comment, index) => (
                  <ListItem
                    className={styles.comment}
                    key={`${comment}${index}`}
                    avatar={comment.photoURL}
                    caption={comment.displayName}
                    legend={comment.text}
                    rightIcon="reply"
                  />
                ))}

                <ListSubHeader caption="Adicionar Comentário" />

                <form className={styles.commentForm}>
                  <div className={styles.commentBox}>
                    <Avatar className={styles.commentAvatar}>
                      <img src="https://avatars2.githubusercontent.com/u/7416751?v=3&s=466" />
                    </Avatar>

                    <Input className={styles.commentInput} multiline label="Adicionar Comentário" value={this.state.comment} onChange={this.handleCommentChange} />
                  </div>

                  <Button
                    type="submit"
                    className={styles.commentButton}
                    icon="send"
                    label="Enviar"
                    primary
                    onClick={this.submitComment}
                  />
                </form>
              </List>
            </Card>
          </section>
        </Panel>
      )
  }
}

export default withRouter(Show)

