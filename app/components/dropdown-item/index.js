import React, { Component } from 'react'
import styles from './styles'

const DropdownItem = (props) => (
  <div className={styles.container}>
    <img src={props.img} className={styles.image} />
    <div className={styles.content}>
      <strong>{props.name}</strong>
      <small>10 receitas</small>
    </div>
  </div>
)

export default DropdownItem

