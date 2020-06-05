import React, {useEffect} from 'react'
import axios from 'axios';

import "@brainhubeu/react-carousel/lib/style.css";
import './App.css'

import Card from '@material-ui/core/Card'
import ImageCarousel from './components/ImagesCarousel';
import DatePicker from './components/DatePicker'

import { FormHelperText, Button } from '@material-ui/core';

const App = () => {
  const [images, setImages] = React.useState([])

  const fetchImages = async () => {
    const when  = new Date().toISOString() 
    const response  = await axios.get(`${window.location.origin}/api/images-by-date?when=${when}`)
    if ( !(response.status==200) ){
      return console.log("ERROR: could not fetch image info: \n", response)
    } else {
      setImages(response.data)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  return (
    <div>
      <p>Meteor Images</p>
      {
        images.map((item, index) => (
          <img key={index} src={`/images${item.filePath}`}/>
        ))
      }
    </div>
  )
}

export default App