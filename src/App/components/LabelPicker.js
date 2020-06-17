import React from 'react'

import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect'
import Button from '@material-ui/core/Button'
import Send from '@material-ui/icons/Send'

const labels = require('../../../labels.json')


const LabelPicker = (props) => {
  const [value, setValue] = (props.value !== undefined) ? [props.value, props.setValue] : React.useState()
  
  const handleChange = (event) => {
    const newValue = event.target.value
    
    setValue(newValue)

    if (props.handleChange) props.handleChange(newValue)
  }

  return (
  <FormControl style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "center"}}>    
    <NativeSelect
      id={`select_${props.imageId}`}
      style={{flex: 10}}
      value={value}
      onChange={handleChange}
      disabled={props.disabled}
      >
        <option value="">Choose A Label</option>
      
      {labels.map(labelOption => {return (
        <option key={labelOption} value={labelOption}>{labelOption}</option>
      )})}

    </NativeSelect>
    
    {props.submit && !props.disabled &&
      <Button 
        onClick={() => props.submit(props.imageId, value)}
        style={{flex: 1}}
        id={`select_send_${props.imageId}`}
        > 
        <Send /> Send
      </Button>
    }

  </FormControl>
  )
}

export default LabelPicker