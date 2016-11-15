import React, { Component } from 'react'
import Promise from 'bluebird'
import R from 'ramda'
import { withRouter } from 'react-router'
import { database, storage } from 'lib/firebase'

import {
  AppBar,
  AutoComplete,
  BrowseButton,
  Card,
  CardMedia,
  Chip,
  Dropdown,
  IconButton,
  Input,
  List,
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

import styles from './styles'

class New extends Component {
  constructor (props) {
    super(props)

    this.state = {
      data: {
        picture: null,
        title: 'Pudim de Milho',
        time: '30',
        portion: '5',
        difficulty: 'easy',
        tags: [
          'pudim',
          'receita da vovó'
        ],
        steps: [
          'Bata o milho e os outros ingredientes no liquidificador',
          'Misture os ovos e mexa bem',
          'Coloque no forno pré-aquecido a 180C'
        ],
        ingredients: [
          '3 ovos',
          '200 gramas de milho',
          '1 colhere de sopa de fermento',
          '4 xícaras de leite'
        ]
      },

      inputs: {
        tag: '',
        step: '',
        ingredient: '',
      },

      recipeImagePreview: 'https://d13yacurqjgara.cloudfront.net/users/386433/screenshots/1689880/placehold.gif',

      activeInput: null
    }
  }

  createIcon = icon => (
    <IconButton className={styles.inputIcon} tabIndex="-1">{icon}</IconButton>
  )

  difficultyValues = [
    { value: 'very_easy', label: 'Muito Fácil' },
    { value: 'easy', label: 'Fácil' },
    { value: 'average', label: 'Médio' },
    { value: 'hard', label: 'Difícil' },
    { value: 'very_hard', label: 'Muito Difícil' }
  ]

  icons = {
    difficulty: this.createIcon(<DifficultyIcon />),
    ingredient: this.createIcon(<IngredientIcon />),
    portion: this.createIcon(<PortionIcon />),
    step: this.createIcon(<StepIcon />),
    time: this.createIcon(<TimeIcon />),
  }

  getClassForInput = input => {
    if (input === this.state.activeInput) {
      return styles.activeInput
    }

    return styles.input
  }

  handleDataChange = field => value => {
    const data = R.merge(this.state.data, { [field]: value })

    this.setState({ data })
  }

  handleInputChange = field => value => {
    const inputs = R.merge(this.state.inputs, { [field]: value })

    this.setState({ inputs })
  }

  handleInputFocus = field => () => {
    this.setState({
      activeInput: field
    })
  }

  handleInputBlur = field => () => {
    this.setState({
      activeInput: null
    })
  }

  handleDifficultyChange = difficulty => {
    const data = R.merge(this.state.data, { difficulty })

    this.setState({ data })
  }

  addItemToData = R.curry((dataId, inputId, event) => {
    if (event.keyCode !== 13) return

    const item = event.target.value
    const list = R.prop(dataId, this.state.data)
    const input = R.prop(inputId, this.state.inputs)
    const newList = R.append(item, list)

    const data = R.merge(this.state.data, { [dataId]: newList })
    const inputs = R.merge(this.state.inputs, { [inputId]: '' })

    this.setState({ data, inputs })
  })

  removeItemFromData = R.curry((dataId, item) => {
    const list = R.prop(dataId, this.state.data)
    const index = R.findIndex(R.equals(item), list)
    const newList = R.remove(index, 1, list)

    const data = R.merge(this.state.data, { [dataId]: newList })

    this.setState({ data })
  })

  publish = () => {
    const createRecipe = () => {
      return database()
        .ref('recipes')
        .push(this.state.data)
        .then(R.prop('key'))
    }

    const uploadPicture = (key) => {
      return storage()
        .ref('recipes')
        .child(key)
        .put(this.state.data.picture)
        .then(R.always(key))
    }

    const getDownloadURL = (key) => {
      return storage()
        .ref('recipes')
        .child(key)
        .getDownloadURL()
        .then(downloadURL => ({ downloadURL, key }))
    }

    const updateRecipeWithPicture = ({ key, downloadURL }) => {
      return database()
        .ref('recipes')
        .child(key)
        .set(R.merge(this.state.data, { image: downloadURL }))
    }

    return Promise.resolve()
      .then(createRecipe)
      .then(uploadPicture)
      .then(getDownloadURL)
      .then(updateRecipeWithPicture)
      .then(console.info)
  }

  handleFileInput = () => {
    const { fileInput } = this.refs

    fileInput.click()
  }

  displayImagePreview = file => {
    const fileReader = new FileReader()

    fileReader.readAsDataURL(file)

    fileReader.addEventListener('load', event => {
      const recipeImagePreview = event.target.result

      this.setState({ recipeImagePreview })
    })
  }

  handlePhotoChange = event => {
    const target = event.target
    const picture = target.files[0]

    if (picture) {
      const data = R.merge(this.state.data, { picture })

      this.displayImagePreview(picture)

      this.setState({ data })
    }
  }

  render () {
    return (
      <Panel scrollY>
        <input
          type="file"
          ref="fileInput"
          className={styles.fileInput}
          onChange={this.handlePhotoChange}
        />

        <section>
          <AppBar
            rightIcon="send"
            onRightIconClick={this.publish}
          >
            <IconButton icon="arrow_back" inverse={true} onClick={this.props.router.goBack} />
            <span>Nova Receita</span>
          </AppBar>

          <Card>
            <List
              className={styles.list}
              ripple
            >
              <CardMedia
                aspectRatio="wide"
                className={styles.recipeImage}
                image={this.state.recipeImagePreview}
                onClick={this.handleFileInput}
              >
              </CardMedia>

              <ListSubHeader caption="Informações da Receita" />

              <ListItem className={styles.listItemInput}>
                <Input
                  type="text"
                  className={styles.input}
                  icon="local_dining"
                  label="Nome da receita"
                  value={this.state.data.title}
                  onChange={this.handleDataChange('title')}
                />
              </ListItem>

              <ListItem className={styles.listItemInput}>
                <Input
                  type="number" step="10" min="0" max="180"
                  className={this.getClassForInput('time')}
                  icon={this.icons.time}
                  label="Tempo de preparo (minutos)"
                  value={this.state.data.time}
                  onChange={this.handleDataChange('time')}
                  onFocus={this.handleInputFocus('time')}
                  onBlur={this.handleInputBlur('time')}
                />
              </ListItem>

              <ListItem className={styles.listItemDropdown}>
                {this.icons.difficulty}

                <Dropdown
                  auto={false}
                  className={styles.dropdown}
                  label="Dificuldade"
                  onChange={this.handleDifficultyChange}
                  source={this.difficultyValues}
                  value={this.state.data.difficulty}
                />
              </ListItem>

              <ListItem className={styles.listItemInput}>
                <Input
                  type="number"
                  className={this.getClassForInput('portion')}
                  icon={this.icons.portion}
                  label="Número de porções"
                  value={this.state.data.portion}
                  onChange={this.handleDataChange('portion')}
                  onFocus={this.handleInputFocus('portion')}
                  onBlur={this.handleInputBlur('portion')}
                />
              </ListItem>

              <ListDivider className={styles.listDivider} />

              <ListSubHeader caption="Ingredientes" />

              <ListItem className={styles.listItemInput}>
                <Input
                  className={this.getClassForInput('ingredient')}
                  icon={this.icons.ingredient}
                  label="Ingrediente e quantidade"
                  value={this.state.inputs.ingredient}
                  onChange={this.handleInputChange('ingredient')}
                  onFocus={this.handleInputFocus('ingredient')}
                  onBlur={this.handleInputBlur('ingredient')}
                  onKeyDown={this.addItemToData('ingredients', 'ingredient')}
                />
              </ListItem>

              <div>
                {this.state.data.ingredients.length > 0 && (
                  this.state.data.ingredients.map((ingredient, index) =>
                    <ListItem
                      caption={ingredient}
                      className={styles.listItemIngredient}
                      rightIcon="clear"
                      key={`${ingredient}_${index}`}
                      onClick={() => this.removeItemFromData('ingredients', ingredient)}
                    >
                      <IconButton><IngredientIcon /></IconButton>
                    </ListItem>
                  )
                )}
              </div>

              <ListDivider className={styles.listDivider} />

              <ListSubHeader caption="Modo de Preparo" />

              <ListItem className={styles.listItemInput}>
                <Input
                  className={this.getClassForInput('step')}
                  icon={this.icons.step}
                  label="Descrição do passo-a-passo"
                  value={this.state.inputs.step}
                  onChange={this.handleInputChange('step')}
                  onFocus={this.handleInputFocus('step')}
                  onBlur={this.handleInputBlur('step')}
                  onKeyDown={this.addItemToData('steps', 'step')}
                />
              </ListItem>

              <div>
                {this.state.data.steps.length > 0 && (
                  this.state.data.steps.map((step, index) =>
                    <ListItem
                      caption={step}
                      className={styles.listItemStep}
                      rightIcon="clear"
                      key={`${step}_${index}`}
                      onClick={() => this.removeItemFromData('steps', step)}
                    >
                      <strong>{index + 1}</strong>
                    </ListItem>
                  )
                )}
              </div>

              <ListDivider className={styles.listDivider} />

              <ListSubHeader caption="Tags" />

              <ListItem className={styles.listItemInput}>
                <Input
                  className={styles.input}
                  icon="label_outline"
                  label="Tag"
                  value={this.state.inputs.tag}
                  onChange={this.handleInputChange('tag')}
                  onKeyDown={this.addItemToData('tags', 'tag')}
                />
              </ListItem>

              <div>
                {this.state.data.tags.length > 0 && (
                  <ListItem className={styles.listItemTags} >
                    {this.state.data.tags.map((tag, index) =>
                      <Chip
                        deletable
                        key={`${tag}_${index}`}
                        onDeleteClick={() => this.removeItemFromData('tags', tag)}
                      >
                        {tag}
                      </Chip>
                    )}
                  </ListItem>
                )}
              </div>

              <ListDivider className={styles.listDivider} />

              <ListItem
                caption="Publicar Receita"
                leftIcon="send"
                onClick={this.publish}
              />
            </List>
          </Card>

          <BrowseButton
            className={styles.addPicture}
            onChange={this.handlePhotoChange}
            icon="add_a_photo"
            accent
            floating
          />
        </section>
      </Panel>
    )
  }
}

export default withRouter(New)

