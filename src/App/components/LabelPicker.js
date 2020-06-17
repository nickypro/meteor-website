import React from 'react'

import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect'
import Button from '@material-ui/core/Button'

const labels = require('../labels.json')


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
      style={{flex: 10}}
      value={value}
      onChange={handleChange}
      >
        <option value="">Choose A Label</option>
      
      {labels.map(labelOption => {return (
        <option key={labelOption} value={labelOption}>{labelOption}</option>
      )})}

    </NativeSelect>
    
    {props.submit &&
      <Button style={{flex: 1}} onClick={() => props.submit(value)}> 
        Send Label 
      </Button>
    }

  </FormControl>
  )
}

export default LabelPicker