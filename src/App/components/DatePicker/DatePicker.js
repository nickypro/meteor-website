import React from 'react'
import "./DatePicker.css"

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";

const DatePicker = (props) => {

  return (<MuiPickersUtilsProvider utils={DateFnsUtils}>
    <div style={{position: "relative"}}>
      <KeyboardDateTimePicker
        variant="inline"
        ampm={false}
        label="Chose a time"
        value={props.value}
        onChange={props.onChange}
        onError={console.log}
        format="yyyy/MM/dd HH:mm"
      />
    </div>
  </MuiPickersUtilsProvider>
  )
};

export default DatePicker;