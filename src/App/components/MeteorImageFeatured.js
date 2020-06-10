import React, {useEffect} from 'react'
import axios from 'axios';

import Card from '@material-ui/core/Card'
import ImageCarousel from './MeteorImagesCarousel';
import DatePicker from './DatePicker'
import { useLocaleSetsState } from '../functions/hooks'

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

const MeteorImageFeatured = (props) => {
  const [images, setImages] = React.useState([])
  const [page, setPage] = React.useState(0);
  const [carouselRef, setCarouselRef] = React.useState();
  const [starred, setStarred] = useLocaleSetsState("starred_images")

  const fetchImages = async (options = {}) => {

    let query = ""
    query += (options.page) ? `page=${options.page}&` : "" 

    const response  = await axios.get(`${window.location.origin}/api/images-by-stars?${query}`)
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

  const toggleStar = (id) => {
    if (starred.has(id)) {
      document.getElementById(`button_${id}`).classList.remove("starred")
      const tempSet = starred;
      tempSet.delete(id)
      setStarred(tempSet)
      axios.post(`${window.location.origin}/api/toggle-star?id=${id}&action=REMOVE`)
      return;
    }
    if (!starred.has(id)) {
      document.getElementById(`button_${id}`).classList.add("starred")
      const tempSet = starred;
      tempSet.add(id)
      setStarred(tempSet)
      axios.post(`${window.location.origin}/api/toggle-star?id=${id}&action=ADD`)
      return;
    }
  }

  //get images on first load and when date changes
  useEffect(() => {
    fetchImages()
  }, [])

  const changePageTo = (newPage) => {
    setPage(newPage)
    fetchImages({newPage})

    let newIndex = 1
    if (newPage < page) newIndex += images.length - 1
    if (newPage === 0) newIndex -= 1

    setTimeout(() => carouselRef.slickGoTo( newIndex ), 300)
  }

  return (
    <div className="root__content" style={{backgroundColor: "rgba(3, 20, 38, 0.1)", width: "100vw"}}>
      <h1 style={{margin: "0.5rem"}}>
        {"Featured" + (page ? ` - Page ${page}` : "")}
      </h1>

      <Card style={cardStyling}>
        Options to be added
      </Card>
      
      <div className="list-of-images">
        <ImageCarousel 
          images={images} 
          setCarouselRef={setCarouselRef} 
          getEarlier={page ? ( () => changePageTo(page-1) ) : false}
          getLater={() => changePageTo(page+1)}
          starred={starred}
          toggleStar={toggleStar}
        />
      </div>
    </div>
  )
}

export default MeteorImageFeatured