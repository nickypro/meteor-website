import React from 'react'

import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect'
import Button from '@material-ui/core/Button'
import Send from '@material-ui/icons/Send'

const Picker = (props) => {
  const [localValue, setLocalValue] = React.useState("")
  const [value, setValue] = (props.value !== undefined) ? [props.value, props.setValue] : [localValue, setLocalValue]
  const choices = props.choices || []

  const handleChange = (event) => {
    const newValue = event.target.value
    
    if (setValue) setValue(newValue)

    if (props.onChange) props.onChange(newValue)
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
        <option value="">{props.placeholder || "Choose an Option"}</option>
      
      {choices.map(choice => 
        <option key={choice} value={choice}>{choice}</option>
      )}

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

export default Picker