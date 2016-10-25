import React, { Component } from 'react'

import {
  AppBar,
  IconButton,
  Panel,
} from 'react-toolbox'

class List extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Panel scrollY>
        <AppBar style={{ display: 'flex' }}>
          <IconButton icon="menu" inverse={true} onClick={this.props.onToggleDrawer} />
          <span>RECEITAS</span>
        </AppBar>
      </Panel>
    )
  }
}

export default List
