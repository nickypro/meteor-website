import React, {useEffect} from 'react'
import axios from 'axios';

import Card from '@material-ui/core/Card'
import {Element} from 'react-scroll'

import ImageCarousel from './MeteorImagesCarousel';
import DatePicker from './DatePicker'
import { useLocaleSetsState } from '../functions/hooks'
import LabelPicker from './LabelPicker';

const path = require('path')
const config = require('../../config.json')
const homepage = config.homepage

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
  
  const [state, setState] = React.useState({
    selectedDate: null,
    minDate: null,
    maxDate: null,
    page: 0,
    labelFilter: "",
    starFilter: 0,
  })

  const apiUrl = path.join( homepage, "/api/" )

  //set up request to get data from images
  const getImages = async (options = {}) => {
    let query = ""
    let api = ""
    
    switch (options.flag) {
      case "EARLIER":
        const minDate = state.minDate || images[0].date
        api = `images-by-date`
        query = `before=${minDate}&`
        setState({...state, selectedDate: minDate})
        carouselRef.slickGoTo(images.length)
        break;

      case "LATER":
        const maxDate = state.maxDate || images[images.length-1].date
        api = `images-by-date`
        query = `after=${maxDate}&`
        setState({...state, selectedDate: maxDate})
        carouselRef.slickGoTo(1)
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
    const useMinStarsFilter = (options.flag == "MINSTARS_CHANGE") ? options.minStars : state.minStars || null
    if (useLabelFilter) {
      query += `label=${useLabelFilter}&`
    }
    if (useMinStarsFilter) {
      query += `label=${useMinStarsFilter}&`
    }

    fetchImages(api, query)
  }

  //get data about images 
  async function fetchImages(api, query = "") {
  try {
    //request data from /api/<chosen api>?querydata=data
    console.log(`Getting from ${api} with ?${query}`)
    const response = await axios.get(`${apiUrl}${api}?${query}`)

    if ( !(response.status==200) ){
      //if not successful, console.log the error
      return console.log("ERROR: could not fetch image info: \n", response)
    
    } else {
      //if successful request, set carousel to use new images
      let list = response.data;

      if (list.length & list.length > 0) {
      list = list.sort((img1, img2) => 
        Number(new Date(img1.date)) - Number(new Date(img2.date)) 
      )
      const minDate = list[0].date
      const maxDate = list[list.length-1].date
      console.log("min date: ", minDate)
      console.log("max date: ", maxDate)
      setState({...state, minDate, maxDate})
      } 

      setImages(list)
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

  const handleMinStarsChange = (event) => {
    const newValue = event.target.value
    console.log(newValue)
    if (typeof newValue !== typeof 1) return

    setState({...state, minStars: newValue})
    getImages({minStars: newValue, flag: "MINSTARS_CHANGE"})
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

  //on images change, move carousel to closest value
  useEffect(() => {
    if (!images) return;
    if (!state.selectedDate) return;
    
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
      return changePageTo(state.page-0+1)
    }
  }

  return (
  <>
    <div className="root__content meteor-images-search" style={{backgroundColor: "rgba(3, 20, 38, 0.2)", width: "100vw"}}>
      <h1 style={{margin: "0.5rem"}}>
        {state.selectedDate ? `Search - ${state.selectedDate}` : "Featured Images"}
      </h1>

      <Card style={cardStyling}>
        <span>Options </span>
        <DatePicker 
          value={state.selectedDate} 
          onChange={handleDateChange}
          dotsUrl={`${apiUrl}days-with-data`}
        />
        <LabelPicker value={state.labelFilter} onChange={handleLabelFilterChange} />
        <label >
          Min Stars
          <input 
            type="number" 
            placeholder="0 (show all)" 
            className="options-input"
            style={{width: "5rem"}}
            value={state.value}
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
          toggleStar={toggleStar}
          sendLabel={sendLabel}
        />
      </div>
    </div>
  </>
  )
}

export default MeteorImageSearch