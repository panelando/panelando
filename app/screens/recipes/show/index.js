import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'

import styles from './styles'

class Show extends Component {
  render () {
    return (
      <div>
        <strong>Recipe List</strong>
        <pre>Params: {JSON.stringify(this.props.params, null, 2)}</pre>
      </div>
    )
  }
}

export default Show

