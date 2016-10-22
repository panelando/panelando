import React from 'react'
import DOM from 'react-dom'
import styles from 'react-toolbox/lib/commons'
import App from './routes'
import { Grid } from 'react-flexbox-grid/lib/index'

DOM.render((
  <App />
), document.getElementById('app'))
