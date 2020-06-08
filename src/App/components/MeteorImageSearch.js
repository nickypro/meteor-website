import React, {useEffect} from 'react'
import axios from 'axios';

import Card from '@material-ui/core/Card'
import ImageCarousel from './ImagesCarousel';
import DatePicker from './DatePicker'

const cardStyling = {
  height: "4rem",
  padding: "1rem 2rem", 
  margin: "0.5rem",
  background: "rgb(34, 54, 76)",
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

const MeteorImageSearch = (props) => {
  const [images, setImages] = React.useState([])
  const [selectedDate, handleDateChange] = React.useState(new Date("2020-04-06T02:00:00.000Z"));
  const [carouselRef, setCarouselRef] = React.useState();

  const fetchImages = async () => {
    if (!isValidDate(selectedDate)) return console.log("Non-valid date, skipping fetch");
    const when  = selectedDate.toISOString() 

    const response  = await axios.get(`${window.location.origin}/api/images-by-date?when=${when}&number=`)
    if ( !(response.status==200) ){
      return console.log("ERROR: could not fetch image info: \n", response)
    } else {
      const list = response.data.sort((img1, img2) => Number(new Date(img1.date)) - Number(new Date(img2.date)) )
      setImages(list)

      //get the index of the closest value
      let minIndex = 0;
      for (let i in list) {
        if (Math.abs(list[i].diff) < Math.abs(list[minIndex].diff)) {
          minIndex = i
        }
      }

      console.log(carouselRef, minIndex)
      setTimeout(() => {
        carouselRef.slickGoTo(minIndex)
      }, 100);
    }
  }

  useEffect(() => {
    fetchImages()
  }, [selectedDate])

  return (
    <div className="root__content">
      <Card style={cardStyling}>
        <DatePicker value={selectedDate} onChange={handleDateChange}/>
      </Card>
      
      <div className="list-of-images">
        <ImageCarousel images={images} setCarouselRef={setCarouselRef}/>
      </div>
    </div>
  )
}

export default MeteorImageSearch