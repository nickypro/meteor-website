import React from 'react'

import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect'
import Button from '@material-ui/core/Button'
import Send from '@material-ui/icons/Send'

/* pick from a dropdown
If you want to make a new filter:
const LabelPicker = (props) => {
  return <Picker 
    value={ currentDropdownValueVariable }
    onChange={ (newValue) => { 
      #insert-callback-function-here 
    }}
    choices={["List", "Of", "Labels"]}
    placeholder={"Choose a Label"}
  />

Example Usage:
<Picker 
    imageId={props.imageId} 
    value={props.value}
    onChange={props.onChange}
    submit={props.submit}
    disabled={props.disabled}
    choices={labels}
    placeholder={"Choose a Label"}
/>
*/

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
      
      {
      // if array like ["tree", "cloud"] map simply
        choices instanceof Array 
      ? choices.map(choice => 
        <option key={choice} value={choice}>{choice}</option>
      )
      
      // elif object like {"id": "label", "IE02" : "AllSky"} map like so
      : choices instanceof Object 
      ? Object.keys(choices).map(id =>
        <option key={id} value={id}>{choices[id]}</option>
      )

      //else null
      : null
      }

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