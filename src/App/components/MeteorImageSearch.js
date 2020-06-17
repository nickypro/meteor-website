import React, {useEffect} from 'react'
import axios from 'axios';

import Card from '@material-ui/core/Card'
import ListItem from '@material-ui/core/ListItem';

import ImageCarousel from './MeteorImagesCarousel';
import DatePicker from './DatePicker'
import { useLocaleSetsState } from '../functions/hooks'
import LabelPicker from './LabelPicker';

const cardStyling = {
  padding: "1rem 2rem", 
  margin: "0.5rem",
  background: "rgb(34, 54, 76)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

const MeteorImageSearch = (props) => {
  const [images, setImages] = React.useState([])
  const [carouselRef, setCarouselRef] = React.useState();
  
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [page, setPage] = React.useState(0);

  //set up request to get data from images
  const getImages = async (options = {}) => {
    let query = ""
    let api = ""
    
    switch (options.flag) {
      case "EARLIER":
        api = `images-by-date`
        query = `before=${images.minDate}`
        setSelectedDate(images.minDate)
        carouselRef.slickGoTo(images.length)
        break;

      case "LATER":
        api = `images-by-date`
        query = `after=${images.maxDate}`
        setSelectedDate(images.maxDate)
        carouselRef.slickGoTo(1)
        break;

      case "DATE_CHANGE":
        api = `images-by-date`
        query = `when=${new Date(options.when).toISOString()}`
        break;

      case "PAGE_CHANGE": 
        api = `images-by-stars`
        query = `page=${options.page}&`
        break;
        
      default:
        api = `images-by-stars`
        query = ""
        break;
    }

    fetchImages(api, query)
  }

  //get data about images 
  async function fetchImages(api, query = "") {
    //request data from /api/<chosen api>?querydata=data
    console.log(`Getting from ${api} with ?${query}`)
    const response = await axios.get(`${window.location.origin}/api/${api}?${query}`)

    if ( !(response.status==200) ){
      //if not successful, console.log the error
      return console.log("ERROR: could not fetch image info: \n", response)
    
    } else {
      //if successful request, set carousel to use new images
      let list = response.data;

      list = list.sort((img1, img2) => 
        Number(new Date(img1.date)) - Number(new Date(img2.date)) 
      )
      list.minDate = list[0].date
      list.maxDate = list[list.length-1].date
      console.log("min date: ", list.minDate)
      console.log("max date: ", list.maxDate)

      setImages(list)
    }
  }

  //toggle star and update card to have filled/infilled star & send POST to api 
  const toggleStar = (id) => {

    const isNowStarred = props.toggleStar(id).starred

    if (isNowStarred) {
      document.getElementById(`button_${id}`).classList.add("starred")
      axios.post(`${window.location.origin}/api/toggle-star?id=${id}&action=ADD`)
      return;

    } else {
      document.getElementById(`button_${id}`).classList.remove("starred")
      axios.post(`${window.location.origin}/api/toggle-star?id=${id}&action=REMOVE`)
      return;

    }
  }

  const sendLabel = (id, label) => {
    console.log(props.userMeteorInfo[id])
    if (!label) return
    if (props.userMeteorInfo[id] && props.userMeteorInfo[id].label) return

    props.setLabel(id, label)
    document.getElementById(`select_${id}`).setAttribute("disabled", true)
    document.getElementById(`select_send_${id}`).setAttribute("style", "display: none;")
    axios.post(`${window.location.origin}/api/submit-label?id=${id}&label=${label}`)
  }

  // update the date when calendar changes
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
    getImages({when: newDate, flag: "DATE_CHANGE"})
    setPage(0)
  }

  //change page if in featured view
  const changePageTo = (newPage) => {
    setPage(newPage)
    getImages({page: newPage, flag: "PAGE_CHANGE"})

    let newIndex = 1
    if (newPage < page) newIndex += images.length - 1
    if (newPage === 0) newIndex -= 1

    setTimeout(() => carouselRef.slickGoTo( newIndex ), 200)
  }

  //get images on first load and when date changes
  useEffect(() => {
    getImages()
  }, [])

  //on images change, move carousel to closest value
  useEffect(() => {
    if (!images) return;
    if (!selectedDate) return;
    
    //get the index of the closest value
    let minIndex = 0;
    for (let i in images) {
      if (Math.abs(images[i].diff) < Math.abs(images[minIndex].diff)) {
        minIndex = i
      }
    }
    
    //move to this index (and add 1 due to offset from buttons)
    setTimeout(() => {
      if (!carouselRef) return;
      carouselRef.slickGoTo(minIndex-0+1)
    }, 200);

  }, [images])

  // function control for buttons 
  function getEarlier() {
    if(selectedDate) {
      return getImages({flag: "EARLIER"})
    }
    if (page) {
      return changePageTo(page-1)
    }
  }

  function getLater() {
    if (selectedDate) {
      return getImages({flag: "LATER"})
    }
    else {
      return changePageTo(page-0+1)
    }
  }

  return (
    <>
    <div className="root__content" style={{width: "100vw"}}>
      <h1 style={{margin: "0.5rem"}}>
        {selectedDate ? `Search - ${selectedDate}` : "Featured Images"}
      </h1>

      <Card style={cardStyling}>
        <span>Options </span>
        <DatePicker 
          value={selectedDate} 
          onChange={handleDateChange}
          dotsUrl={`${window.location.origin}/api/days-with-data`}
        />
        <LabelPicker />
      </Card>
      
      <div className="list-of-images">
        <ImageCarousel 
          images={images} 
          setCarouselRef={setCarouselRef} 
          getEarlier={getEarlier}
          getLater={getLater}
          userMeteorInfo={props.userMeteorInfo}
          toggleStar={toggleStar}
          sendLabel={sendLabel}
        />
      </div>
    </div>
    <div className="root__content" style={{width: "100vw"}}>
      <Card style={cardStyling}>
      <h3>
        List of Images
      </h3>
      {images.map(img => {
        return (
          <div key={img.filePath}>
            <a href={img.filePath}>
              <ListItem button>
                {img.filePath} 
              </ListItem> 
            </a>
          </div>
        ) 
      })

      }
      </Card> 
    </div>
    </>
  )
}

export default MeteorImageSearch