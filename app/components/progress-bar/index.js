import React from 'react'
import { ProgressBar as Bar } from 'react-toolbox'
import styles from './styles'


const ProgressBar = (props) => {
  if (props.loading) {
    return (
      <div className={styles.progressBar}>
        <Bar
          type="circular"
          mode="indeterminate"
          multicolor
        />
      </div>
    )
  }

  return <div />
}


export default ProgressBar

