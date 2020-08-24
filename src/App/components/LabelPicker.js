import React from 'react'

import Picker from './Picker'

const config = require('../../config.json')
const labels = config.labels

const LabelPicker = (props) => {
  return <Picker 
    value={props.value}
    onChange={props.onChange}
    submit={props.submit}
    disabled={props.disabled}
    choices={labels}
    placeholder={"Choose a Label"}
  />
}

export default LabelPicker