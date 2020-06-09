import React, { useEffect } from 'react'
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
      borderColor: "hotpink",
      right: '50%',
      transform: 'translateX(1px)',
      top: '80%'
  }
}))

const DatePicker = (props) => {
  {/* Code for calendar dots */}
  const [daysWithDot, setDaysWithDot] = React.useState( new Set() )

  const classes = useStyles()

  useEffect(() => {
    fetchCalendarDots()
  }, [])

  const fetchCalendarDots = () => {
    return axios.get( props.dotsUrl ).then(response => {
      const set = new Set()
      response.data.forEach( item => set.add( doFormat(item.day) ) )  
      console.log(set)
      setDaysWithDot( set )
    }).catch( err  => console.log("Error getting data for calendar dots:  ",err))
  }

  const renderDayInPicker = (date, selectedDate, dayInCurrentMonth, dayComponent) => {
    if ( daysWithDot.has( doFormat(date) ) ) {
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
      />
    </div>
  </MuiPickersUtilsProvider>
  )
};

export default DatePicker;