import React, { Component } from 'react'
import R from 'ramda'
import { auth, database, normalize } from 'lib/firebase'
import { DropdownItem } from 'components'

import {
  Dialog,
  Dropdown,
  Input,
  List,
  ListItem,
  ListSubHeader,
  ListDivider
} from 'react-toolbox'

import styles from './styles'

class MenuDialog extends Component {
  state = {
    selectedMenu: null,
    newMenu: '',
    menus: []
  }

  handleNewChange = value => {
    this.setState({ newMenu: value })
  }

  handleDropdownChange = value => {
    this.setState({ selectedMenu: value })
  }

  save = () => {
    const uid = auth().currentUser.uid
    const ref = database().ref(`menus/${uid}`)

    const name = this.state.newMenu ? this.state.newMenu : this.state.selectedMenu
    const recipe = this.props.recipe

    if (!name) return

    return ref.once('value')
      .then(R.invoker(0, 'val'))
      .then(R.defaultTo([]))
      .then(menus => {
        let index = R.findIndex(R.propEq('name', name), menus)
        let menu = R.find(R.propEq('name', name), menus)

        if (menu) {
          let recipes = R.append(recipe, R.prop('recipes', menu))
          let newMenus = R.assoc('recipes', recipes, menu)
          return R.update(index, newMenus, menus)
        }

        return R.append({
          name: name,
          image: recipe.image,
          recipes: [recipe]
        }, menus)
      })
      .then(menus => {
        this.props.onDialogToggle()
        return ref.set(menus)
      })
      .then(() => {
        this.setState({ selectedMenu: null, newMenu: '' })
      })
  }

  actions = [
    { label: 'Cancelar', onClick: this.props.onDialogToggle },
    { label: 'Salvar', onClick: this.save }
  ]

  componentDidMount () {
    const uid = auth().currentUser.uid
    const ref = database().ref(`menus/${uid}`)

    ref.once('value')
      .then(R.invoker(0, 'val'))
      .then(R.defaultTo([]))
      .then(R.map(menu => {
        const length = R.length(R.prop('recipes', menu))
        const description = `${length} ${length > 1 ? 'receitas' : 'receita'}`

        return R.assoc('description', description, menu)
      }))
      .then(R.map(menu => R.assoc('value', R.prop('name', menu), menu)))
      .then(menus => {
        this.setState({ menus })
      })
  }

  render () {
    return (
      <Dialog
        active={this.props.active}
        onEscKeyDown={this.props.onDialogToggle}
        onOverlayClick={this.props.onDialogToggle}
        actions={this.actions}
        title="Adicionar receita ao Menu"
      >
        <p>Escolha um menu para adicionar esta receita ou crie um novo menu.</p>

        <List>
          <ListSubHeader caption="Criar um novo menu" />

          <ListItem className={styles.listItem}>
            <Input
              type="text"
              label="Nome do menu"
              className={styles.input}
              value={this.state.newMenu}
              onChange={this.handleNewChange}
            />
          </ListItem>

          {this.state.menus.length > 0 ? (
            <div>
              <ListSubHeader caption="Escolher de um menu já existente" />

              <ListItem className={styles.listItem}>
                <Dropdown
                  className={styles.input}
                  source={this.state.menus}
                  onChange={this.handleDropdownChange}
                  label="Selecionar menu"
                  template={DropdownItem}
                  value={this.state.selectedMenu}
                />
              </ListItem>
            </div>
          ) : <div />}

        </List>
      </Dialog>
    )
  }
}

export default MenuDialog
