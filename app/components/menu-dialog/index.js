import React, { Component } from 'react'

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
    selectedMenu: 0,
    newMenu: '',
    menus: [{
      value: 1,
      name: 'Receitas de verão',
      img: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d8108430269011.561bad832d25f.jpg',
      recipes: [1, 2]
    }, {
      value: 2,
      name: 'Receitas para fazer com crianças',
      img: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/7058fc30269011.561bad832e69f.jpg',
      recipes: [1, 2, 3, 4]
    }]
  }

  handleNewChange = value => {
    this.setState({ newMenu: value })
  }

  handleDropdownChange = value => {
    this.setState({ selected: value })
  }

  save = () => {
    console.info(this.props)
    console.info(this.state)
  }

  actions = [
    { label: 'Cancelar', onClick: this.props.onDialogToggle },
    { label: 'Salvar', onClick: this.save }
  ]

  dropdownItemTemplate (item) {
    const containerStyle = {
      display: 'flex',
      flexDirection: 'row'
    };

    const imageStyle = {
      display: 'flex',
      width: '32px',
      height: '32px',
      flexGrow: 0,
      marginRight: '8px',
      backgroundColor: '#ccc'
    };

    const contentStyle = {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 2
    };

    return (
      <div style={containerStyle}>
        <img src={item.img} style={imageStyle} />
        <div style={contentStyle}>
          <strong>{item.name}</strong>
          <small>10 receitas</small>
        </div>
      </div>
    );
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
              label="Nome da receita"
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
                  template={this.dropdownItemTemplate}
                  value={this.state.selected}
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
