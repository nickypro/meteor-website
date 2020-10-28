import React, {useEffect} from 'react'
import axios from 'axios';

import Card from '@material-ui/core/Card'
import {Element} from 'react-scroll'

import ImageCarousel from './MeteorImagesCarousel';
import DatePicker from './DatePicker'
import { useLocaleSetsState } from '../functions/hooks'
import LabelPicker from './LabelPicker';
import Picker from './Picker'

const path = require('path')
const config = require('../../config.json')
const homepage = config.homepage
const cameras = config.cameras 

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

// The main control for searching for images
// handles:
//   - alter the properties we use to ask for data
//   - send requests when we need new data

const MeteorImageSearch = (props) => {
  const [images, setImages] = React.useState([])
  const [carouselRef, setCarouselRef] = React.useState();
  
  const [state, setState] = React.useState({
    selectedDate: new Date(),
    page: 0,
    labelFilter: "",
    minStars: 0,
  })
  const [listProperties, setListProperties] = React.useState({
    minDate: null,
    maxDate: null,
  })

  const apiUrl = path.join( homepage, "/api/" )

  //set up request to get data from images
  const getImages = async (options = {}) => {
    let query = ""
    let api = ""
    let concat = false
    
    switch (options.flag) {
      case "EARLIER":
        const minDate = listProperties.minDate || images[images.length-1].date 
        api = `images-by-date`
        query = `before=${minDate}&`
        setState({...state, selectedDate: minDate})
        concat="BEFORE"
        break;

      case "LATER":
        const maxDate = listProperties.maxDate || images[0].date
        api = `images-by-date`
        query = `after=${maxDate}&`
        setState({...state, selectedDate: maxDate})
        concat="AFTER"
        break;

      case "DATE_CHANGE":
        api = `images-by-date`
        query = `when=${new Date(options.when).toISOString()}&`
        break;

      case "PAGE_CHANGE": 
        api = `images-by-stars`
        query = `page=${options.page}&`
        break;
        
      default:
        if ( isValidDate(state.selectedDate) ) {
          api = `images-by-date`
          query = `when=${new Date(state.selectedDate).toISOString()}&`

        } else {
          api = `images-by-stars`
          query = ""

        }
        break;
    }

    const useLabelFilter = (options.flag == "FILTER_CHANGE") ? options.labelFilter : state.labelFilter || null
    const useCameraFilter = (options.flag == "CAMERA_CHANGE") ? options.cameraFilter : state.cameraFilter || null
    const useMinStarsFilter = (options.flag == "MINSTARS_CHANGE") ? options.minStars : state.minStars || null
    if (useLabelFilter) {
      query += `label=${useLabelFilter}&`
    }
    if (useCameraFilter) {
      query += `camera=${useCameraFilter}&`
    }
    if (useMinStarsFilter) {
      query += `minstars=${useMinStarsFilter}&`
    }

    fetchImages(api, query, concat)
  }

  //get data about images 
  async function fetchImages(api, query = "", concat = false) {
  try {
    //request data from /api/<chosen api>?querydata=data
    console.log(`Getting from ${api} with ?${query}`)
    const response = await axios.get(`${apiUrl}${api}?${query}`)

    if ( !(response.status==200) ){
      //if not successful, console.log the error
      return console.log("ERROR: could not fetch image info: \n", response)
    
    } else {
      //if successful request, set carousel to use new images
      // reverse chronological order
      let loadedList = response.data.reverse();
      loadedList = loadedList.sort((a, b) => new Date(b.date) - new Date(a.date) )
      let newList

      if (!concat) newList = loadedList
      if (concat==="BEFORE") newList = [...images, ...loadedList]
      if (concat==="AFTER") newList = [...loadedList, ...images]

      const maxDate = newList[0].date
      const minDate = newList[newList.length-1].date
    
      console.log("min date: ", minDate)
      console.log("max date: ", maxDate)
    
      setListProperties({...listProperties, minDate, maxDate})

      setImages(newList)
    }
  } catch(err) {
    console.error(err.message)
  }
  }

  //toggle star and update card to have filled/infilled star & send POST to api 
  const toggleStar = (id) => {

    console.log(`toggling star for ${id}`)
    const isNowStarred = props.toggleStar(id).starred

    if (isNowStarred) {
      document.getElementById(`button_${id}`).classList.add("starred")
      axios.post(`${apiUrl}toggle-star?id=${id}&action=ADD`)
      return;

    } else {
      document.getElementById(`button_${id}`).classList.remove("starred")
      axios.post(`${apiUrl}toggle-star?id=${id}&action=REMOVE`)
      return;

    }
  }

  const sendLabel = (id, label) => {
    console.log(props.userMeteorInfo[id])
    if (!label) 
      return console.log(`no label selected`)
    if (props.userMeteorInfo[id] && props.userMeteorInfo[id].label) 
      return console.log(`label aready exists for ${id}`)

    props.setLabel(id, label)
    document.getElementById(`select_${id}`).setAttribute("disabled", true)
    document.getElementById(`select_send_${id}`).setAttribute("style", "display: none;")
     
    console.log(`added label ${label} to image ${id}`)
    axios.post(`${apiUrl}submit-label?id=${id}&label=${label}`)
  }

  // update the date when calendar changes
  const handleDateChange = (newDate) => {
    setState({
      ...state, 
      selectedDate: newDate,
      page: 0,
    })
    getImages({when: newDate, flag: "DATE_CHANGE"})
  }

  const handleLabelFilterChange = (newLabel) => {
    setState({...state, labelFilter: newLabel})
    getImages({labelFilter: newLabel, flag: "FILTER_CHANGE"})
  }

  const handleCameraFilterChange = (newCamera) => {
    setState({...state, cameraFilter: newCamera})
    getImages({cameraFilter: newCamera, flag: "CAMERA_CHANGE"})
  }

  const handleMinStarsChange = (event) => {
    try {
      const newValue = Number(event.target.value)
      console.log(newValue)
      if ( newValue < 0 ) return
  
      setState({...state, minStars: newValue})
      getImages({minStars: newValue, flag: "MINSTARS_CHANGE"})

    } catch(err) {
      console.error(err.message)
    
    }
  }

  //change page if in featured view
  const changePageTo = (newPage) => {
    setState({...state, page: newPage})
    getImages({page: newPage, flag: "PAGE_CHANGE"})

    let newIndex = 1
    if (newPage < state.page) newIndex += images.length - 1
    if (newPage === 0) newIndex -= 1

    setTimeout(() => carouselRef.slickGoTo( newIndex ), 200)
  }

  //get images on first load and when date changes
  useEffect(() => {
    getImages()
  }, [])

  function changeIndexToClosest() {
    
    if (!images) return;
    if (!state.selectedDate) return;
    const selectedDate = new Date(state.selectedDate); 

    const diff = (t) => Math.abs( Number(selectedDate) - Number(new Date(t)) ); 

    //get the index of the closest value
    let minIndex = 0;
      for (let i in images) {
        if ( diff(images[i].date) < diff(images[minIndex].date) ) {
          minIndex = i
        }
      }
      
      //move to this index (and add 1 due to offset from buttons)
      setTimeout(() => {
        if (!carouselRef) return;
        carouselRef.slickGoTo(minIndex-0)
      }, 200);
  }

  //on images change, move carousel to closest value
  useEffect(() => 
    changeIndexToClosest()
  , [images])

  // function control for buttons 
  function getEarlier() {
    if(state.selectedDate) {
      return getImages({flag: "EARLIER"})
    }
    if (state.page) {
      return changePageTo(state.page-1)
    }
  }

  function getLater() {
    if (state.selectedDate) {
      return getImages({flag: "LATER"})
    }
    else {
      return changePageTo(state.page-0)
    }
  }

  return (
  <>
    <div className="root__content meteor-images-search" style={{backgroundColor: "rgba(3, 20, 38, 0.2)", width: "100vw"}}>
      {/* Title - If no date is selected, just show images in order of likes ("stars") */}
      <h1 style={{margin: "0.5rem"}}>
        {state.selectedDate ? `Search - ${state.selectedDate}` : "Featured Images"}
      </h1>

      <Card style={cardStyling}>
        <span>Options </span>
        {/* select the date. Here dots refers to dots under dates which have images */}
        <DatePicker 
          value={state.selectedDate} 
          onChange={handleDateChange}
          dotsUrl={`${apiUrl}days-with-data`}
        />
        
        {/* Filter by label (meteor, aircraft, ...)*/}
        <LabelPicker value={state.labelFilter} onChange={handleLabelFilterChange} />
        
        {/* Filter by camera */}
        <Picker 
          value={state.cameraFilter}
          onChange={handleCameraFilterChange}
          choices={cameras}
          placeholder={"Filter by Camera"}
        />
        
        {/** Filter by likes ("stars") */}
        <label  className="options-label">
          Popularity
          <input 
            type="number" 
            placeholder="0 (show all)" 
            className="options-input"
            style={{width: "6rem"}}
            value={state.minStars}
            onChange={handleMinStarsChange}
          />
        </label>
      </Card>
      
      <div className="list-of-images">
        <ImageCarousel 
          images={images || []} 
          setCarouselRef={setCarouselRef} 
          getEarlier={getEarlier}
          getLater={getLater}
          userMeteorInfo={props.userMeteorInfo}
          setDate={(selectedDate) => setState({...state, selectedDate})}
          toggleStar={toggleStar}
          sendLabel={sendLabel}
        />
      </div>
    </div>
  </>
  )
}

export default MeteorImageSearch
