import React from 'react'
import "./DatePicker.css"

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import axios from 'axios'
import {makeStyles } from '@material-ui/core' 
import {MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";

import dateFormat from 'dateformat'
const doFormat = (date) => dateFormat(new Date(date), 'yyyy/mm/dd')

const useStyles = makeStyles((theme) => ({
  dayWithDotContainer: {
      position: 'relative'
  },

  dayWithDot: {
      position: 'absolute',
      height: 0,
      width: 0,
      border: '2px solid',
      borderRadius: 4,
      borderColor: theme.palette.primary.main,
      right: '50%',
      transform: 'translateX(1px)',
      top: '80%'
  }
}))

const DatePicker = (props) => {
  {/* Code for calendar dots */}
  const [daysWithDot, setDaysWithDot] = React.useState([])

  const classes = useStyles()

  const onOpenPicker = () => {
      onPickerViewChange(props.value)
  }

  const onPickerViewChange = async(date) => {
    const year = date.getFullYear()
    return axios.get(`${props.dotsUrl}?date=${year}`).then(response => {
      setDaysWithDot(response.data.map(item => doFormat(item.day) ))
    }).catch((err) => console.log("Error getting data for calendar dots: ",err))
  
  }

  const renderDayInPicker = (date, selectedDate, dayInCurrentMonth, dayComponent) => {
    if (daysWithDot.includes( doFormat(date) )) {
      return (
      <div className={classes.dayWithDotContainer}>
        {dayComponent}
        <div className={classes.dayWithDot}/>
      </div>)
    }

    return dayComponent    
  }
  {/* End of calendar dots code */}

  return (<MuiPickersUtilsProvider utils={DateFnsUtils}>
    <div style={{position: "relative"}}>
      <KeyboardDateTimePicker
        variant="dialog"
        ampm={false}
        label="Chose a time"
        value={props.value}
        onChange={props.onChange}
        onError={console.log}
        format="d MMM yyyy - HH:mm"
        showTodayButton
        renderDay={renderDayInPicker}
        onOpen={onOpenPicker}
        onMonthChange={onPickerViewChange}
        onYearChange={onPickerViewChange}
      />
    </div>
  </MuiPickersUtilsProvider>
  )
};

export default DatePicker;