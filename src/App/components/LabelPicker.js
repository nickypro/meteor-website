import React from 'react'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button'

const labels = require('../labels.json')


const LabelPicker = (props) => {
  const [value, setValue] = React.useState()
  
  const handleChange = (newValue) => {
    
    setValue(newValue)

    if (props.handleChange) props.handleChange(newValue)
  }

  return (
  <FormControl style={{width: "100%", display: "flex", flexDirection: "row"}}>
    <InputLabel id="demo-simple-select-label"> Choose Label: </InputLabel>
    
    <Select
      style={{flex: 10}}
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={value}
      onChange={handleChange}
      >
      
      {labels.map(labelOption => {
        return <MenuItem value={labelOption}>{labelOption}</MenuItem>
      })}

    </Select>
    
    {props.submit &&
      <Button style={{flex: 1}} onClick={() => props.submit(value)}> 
        Send Label 
      </Button>
    }

  </FormControl>
  )
}

export default LabelPicker