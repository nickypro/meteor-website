import React, { useState } from 'react';
import Card from '@material-ui/core/Card'

import Carousel from "react-slick"; 
import Slider from '@material-ui/core/Slider'

import MeteorImageCard from './MeteorImageCard';
import Button from '@material-ui/core/Button';
import ListDialog from './ListDialog'

const TRANSITION_DURATION = 100;

{/* Turns a list of images into a horizontally scrolling list of cards*/}
const ImageCarousel = (props) => {
  const [index, setIndex] = useState(1)
  const [ref, setRef] = useState({})
  const [listOpen, setListOpen] = useState(false)
  const [delay, setDelay] = useState(0)

  const handleIndexChange = (newIndex) => {
    console.log(newIndex)  
    setIndex(newIndex)

    // change date only if swiping sideways by one image 
    // this prevents other precesses from changing it
    if (0 < newIndex & Math.abs(newIndex - index) === 1 & newIndex <= props.images.length) {

      const date = props.images[newIndex-1].date
      console.log(`DATE CHANGE: ${date} at index ${newIndex}`)
      props.setDate(date)
    }
  }

  const carouselOptions = {
    speed: delay,
    infinite: false,
    centerMode: false,
    focusOnSelect: true,
    lazyLoad: "progressive",
    edgeFriction: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    className: "slick-carousel",
  }

  return (
  <>
  <Carousel  {...carouselOptions} 
    afterChange={handleIndexChange}
    ref={carousel => {
      setRef(carousel); 
      props.setCarouselRef(carousel)
    }}
    >
    
    {/* "Load Earlier" button*/}
    {props.getEarlier && 
    <div>
    <div className="center-flex">
      <Card style={cardStyling}>
        <button className="slick-card-button" onClick={props.getEarlier}>
          Load Earlier
        </button>
      </Card>
    </div>
    </div>
    }

    {/* List meteor images */}
    {props.images.map((item, index) => (
      <MeteorImageCard 
        key={`meteor_card_${index}`}
        data={item} 
        starred={props.userMeteorInfo[item.fileName] && props.userMeteorInfo[item.fileName].starred}
        userLabel={props.userMeteorInfo[item.fileName] && props.userMeteorInfo[item.fileName].label}
        toggleStar={() => props.toggleStar(item.fileName)}
        sendLabel={props.sendLabel}
      />
    ))}

    {/* "Load Later" button */}
    {props.getLater && 
    <div>
    <div className="center-flex">
      <Card style={cardStyling}>
        <button className="slick-card-button" onClick={props.getLater}>
          Load Later
        </button>
      </Card>
    </div>
    </div>
    }

  </Carousel>
  <Slider 
    className="carousel-slider"
    min={0}
    max={1 + (props.images && props.images.length)}
    value={index} 
    onChange={handleIndexChange}
  />
  <Button onClick={() => setListOpen(true)} style={{marginTop: "0.5rem"}}>
    LIST
  </Button>
  <ListDialog 
    open={listOpen} 
    onClose={() => setListOpen(false)} 
    images={props.images}
    index={index}
    setIndex={handleIndexChange}
  />
  </>
)};

const cardStyling = {
  position: "relative",
  maxWidth: "80vw",
  background: "rgb(34, 54, 76)",
}

export default ImageCarousel;