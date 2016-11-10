import React, { Component } from 'react'
import R from 'ramda'
import { withRouter } from 'react-router'

import {
  AppBar,
  AutoComplete,
  Button,
  Card,
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
      title: '',
      time: '',
      portion: '',
      difficulty: '',
      ingredients: '',
      steps: '',
      tags: '',
      activeInput: false
    }
  }

  difficultyValues = [
    { value: 'very_easy', label: 'Muito Fácil' },
    { value: 'easy', label: 'Fácil' },
    { value: 'average', label: 'Médio' },
    { value: 'hard', label: 'Difícil' },
    { value: 'very_hard', label: 'Muito Difícil' }
  ]

  getClassForInput = input => {
    if (input === this.state.activeInput) {
      return styles.activeInput
    }

    return styles.input
  }

  handleDifficultyChange = difficulty => {
    this.setState({ difficulty })
  }

  handleChange = field => value => {
    this.setState({
      [field]: value
    })
  }

  handleFocus = field => () => {
    this.setState({
      activeInput: field
    })
  }

  handleBlur = field => () => {
    this.setState({
      activeInput: false
    })
  }

  render () {
    const createIcon = icon =>
      <IconButton className={styles.inputIcon} tabIndex="-1">{icon}</IconButton>

    const icons = {
      difficulty: createIcon(<DifficultyIcon />),
      ingredients: createIcon(<IngredientIcon />),
      portion: createIcon(<PortionIcon />),
      steps: createIcon(<StepIcon />),
      time: createIcon(<TimeIcon />),
    }

    return (
      <Panel scrollY>
        <section>
          <AppBar>
            <IconButton icon="arrow_back" inverse={true} onClick={this.props.router.goBack} />
            <span>Nova Receita</span>
          </AppBar>

          <Card>
            <List>
              <ListSubHeader caption="Informações da Receita" />

              <ListItem className={styles.listItemInput}>
                <Input
                  type="text"
                  className={styles.input}
                  icon="local_dining"
                  label="Nome da receita"
                  value={this.state.title}
                  onChange={this.handleChange('title')}
                />
              </ListItem>

              <ListItem className={styles.listItemInput}>
                <Input
                  type="number" step="10" min="0" max="180"
                  className={this.getClassForInput('time')}
                  icon={icons.time}
                  label="Tempo de preparo (minutos)"
                  value={this.state.time}
                  onChange={this.handleChange('time')}
                  onFocus={this.handleFocus('time')}
                  onBlur={this.handleBlur('time')}
                />
              </ListItem>

              <ListItem className={styles.listItemDropdown}>
                {icons.difficulty}

                <Dropdown
                  auto={false}
                  className={styles.dropdown}
                  label="Dificuldade"
                  onChange={this.handleDifficultyChange}
                  source={this.difficultyValues}
                  value={this.state.difficulty}
                />
              </ListItem>

              <ListItem className={styles.listItemInput}>
                <Input
                  className={this.getClassForInput('portion')}
                  icon={icons.portion}
                  label="Número de porções"
                  value={this.state.portion}
                  onChange={this.handleChange('portion')}
                  onFocus={this.handleFocus('portion')}
                  onBlur={this.handleBlur('portion')}
                />
              </ListItem>

              <ListDivider className={styles.listDivider} />

              <ListSubHeader caption="Ingredientes" />

              <ListItem className={styles.listItemInput}>
                <Input
                  className={this.getClassForInput('ingredients')}
                  icon={icons.ingredients}
                  label="Nome e quantidade do ingrediente"
                  multiline
                  value={this.state.ingredients}
                  onChange={this.handleChange('ingredients')}
                  onFocus={this.handleFocus('ingredients')}
                  onBlur={this.handleBlur('ingredients')}
                />
              </ListItem>

              <ListDivider className={styles.listDivider} />

              <ListSubHeader caption="Modo de Preparo" />

              <ListItem className={styles.listItemInput}>
                <Input
                  className={this.getClassForInput('steps')}
                  icon={icons.steps}
                  label="Descrição do passo-a-passo"
                  multiline
                  value={this.state.steps}
                  onChange={this.handleChange('steps')}
                  onFocus={this.handleFocus('steps')}
                  onBlur={this.handleBlur('steps')}
                />
              </ListItem>

              <ListDivider className={styles.listDivider} />

              <ListSubHeader caption="Tags" />

              <ListItem className={styles.listItemInput}>
                <Input
                  className={styles.input}
                  icon="label_outline"
                  label="Nome da tag"
                  multiline
                  value={this.state.tags}
                  onChange={this.handleChange('tag')}
                />
              </ListItem>

            </List>
          </Card>
        </section>
      </Panel>
    )
  }
}

export default withRouter(New)

