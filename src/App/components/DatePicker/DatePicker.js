import React from 'react'
import "./DatePicker.css"

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";

const DatePicker = (props) => {
  const [selectedDate, handleDateChange] = React.useState(new Date("2018-01-01T00:00:00.000Z"));

  return (<MuiPickersUtilsProvider utils={DateFnsUtils}>
    <div style={{position: "relative"}}>
      <KeyboardDateTimePicker
        variant="inline"
        ampm={false}
        label="Chose a time"
        value={selectedDate}
        onChange={handleDateChange}
        onError={console.log}
        format="yyyy/MM/dd HH:mm"
      />
    </div>
  </MuiPickersUtilsProvider>
  )
};

export default DatePicker;