import React from 'react'
import R from 'ramda'

import {
  Card,
  CardActions,
  CardMedia,
  CardText,
  CardTitle,
  IconButton
} from 'react-toolbox'

import {
  TimeIcon,
  PortionIcon,
  DifficultyIcon
} from 'components/icons'

import { DropdownItem } from 'components'

import styles from './styles'

const translateDifficulty = R.cond([
  [R.equals('very_easy'), R.always('Muito Fácil')],
  [R.equals('easy'), R.always('Fácil')],
  [R.equals('average'), R.always('Médio')],
  [R.equals('hard'), R.always('Difícil')],
  [R.equals('very_hard'), R.always('Muito Difícil')]
])

const RecipeCard = (props) => (
  <Card className={styles.container} key={props.recipe.id}>
    <CardMedia
      aspectRatio="wide"
      image={props.recipe.image}
      onClick={() => props.onSeeDetails(props.recipe.id)}
    />

    <CardTitle
      title={props.recipe.title}
      onClick={() => props.onSeeDetails(props.recipe.id)}
    />

    <CardText className={styles.info}>
      <div>
        <IconButton><TimeIcon /></IconButton>
        <span>{props.recipe.time} min</span>
      </div>

      <div>
        <IconButton><PortionIcon /></IconButton>
        <span>{props.recipe.portion} porções</span>
      </div>

      <div>
        <IconButton><DifficultyIcon /></IconButton>
        <span>{translateDifficulty(props.recipe.difficulty)}</span>
      </div>
    </CardText>

    <CardTitle
      avatar={props.recipe.user.photoURL}
      title={props.recipe.user.displayName}
      subtitle="Food artisan and disruptive entrepreneur"
      style={{ borderTop: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5' }}
    />

    <CardActions>
      <IconButton icon="bookmark_border" onClick={() => props.onBookmark(props.recipe.id)}/>

      {props.canFavorite ? (
        <IconButton className={styles.favorite} icon="favorite_border" onClick={() => props.onFavorite(props.recipe.id)}/>
      ) : (
        <IconButton className={styles.favorite} icon="favorite" onClick={() => props.onUnfavorite(props.recipe.id)}/>
      )}

      <span>{props.recipe.likes ? props.recipe.likes.length : 0}</span>
    </CardActions>
  </Card>
)

export default RecipeCard

