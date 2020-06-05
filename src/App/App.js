import React, {useEffect} from 'react'
import axios from 'axios';

import "@brainhubeu/react-carousel/lib/style.css";
import './App.css'

import Card from '@material-ui/core/Card'
import ImageCarousel from './components/ImagesCarousel';
import DatePicker from './components/DatePicker'

import { FormHelperText, Button } from '@material-ui/core';

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

const App = () => {
  const [images, setImages] = React.useState([])
  const [selectedDate, handleDateChange] = React.useState(new Date("2020-04-10T00:00:00.000Z"));

  const fetchImages = async () => {
    if (!isValidDate(selectedDate)) return console.log("Non-valid date, skipping fetch");
    const when  = selectedDate.toISOString() 

    const response  = await axios.get(`${window.location.origin}/api/images-by-date?when=${when}`)
    if ( !(response.status==200) ){
      return console.log("ERROR: could not fetch image info: \n", response)
    } else {
      setImages(response.data)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [selectedDate])

  return (
    <div className="root__content">
      <div>
        <h1 style={{textAlign: "center"}}>Meteor Images</h1>
      </div>
      <Card style={cardStyling}>
        <DatePicker value={selectedDate} onChange={handleDateChange}/>
      </Card>
      <div className="list-of-images">
        <ImageCarousel images={images}/>
      </div>
    </div>
  )
}

const cardStyling = {
  height: "4rem",
  padding: "1rem 2rem", 
  margin: "0.5rem",
  background: "rgb(34, 54, 76)",
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
}


export default App