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

  const fetchImages = async (flag) => {
    let query = ""
    
    switch (flag) {
      case "EARLIER":
        query = `before=${images.minDate}`
        break;
      case "LATER":
        query = `after=${images.maxDate}`
        break;
      default:
        if ( isValidDate(selectedDate) ) {
          query = `when=${selectedDate.toISOString()}` 
        }
        break;
    }
    
    if (!query || query.length == 0) {
      return console.log("Non-valid date, skipping fetch");
    }

    const response  = await axios.get(`${window.location.origin}/api/images-by-date?${query}`)
    if ( !(response.status==200) ){
      return console.log("ERROR: could not fetch image info: \n", response)
    } else {
      const list = response.data.sort((img1, img2) => Number(new Date(img1.date)) - Number(new Date(img2.date)) )
      list.minDate = list[0].date
      list.maxDate = list[list.length-1].date
      console.log("min date: ", list.minDate)
      console.log("max date: ", list.maxDate)
      setImages(list)
    }
  }

  //get images on first load and when date changes
  useEffect(() => {
    fetchImages()
  }, [selectedDate])

  //on images change, move carousel to closest value
  useEffect(() => {
    if (!images) return;
    
    //get the index of the closest value
    let minIndex = 0;
    for (let i in images) {
      if (Math.abs(images[i].diff) < Math.abs(images[minIndex].diff)) {
        minIndex = i
      }
    }
    
    //move to this index (and add 1 due to offset)
    setTimeout(() => {
      carouselRef.slickGoTo(minIndex-0+1)
    }, 200);

  }, [images])

  return (
    <div className="root__content">
      <h1 style={{margin: "0.5rem"}}>Search</h1>

      <Card style={cardStyling}>
        <DatePicker value={selectedDate} onChange={handleDateChange}/>
      </Card>
      
      <div className="list-of-images">
        <ImageCarousel 
          images={images} 
          setCarouselRef={setCarouselRef} 
          getEarlier={() => fetchImages("EARLIER")}
          getLater={() => fetchImages("LATER")}
        />
      </div>
    </div>
  )
}

export default MeteorImageSearch