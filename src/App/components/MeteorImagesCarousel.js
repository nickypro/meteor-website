import React, { useState } from 'react';
import Card from '@material-ui/core/Card'

import Carousel from "react-slick"; 

import MeteorImageCard from './MeteorImageCard';

const ImageCarousel = (props) => {
  const carouselOptions = {
    dots: true,
    speed: 100,
    infinite: false,
    centerMode: true,
    focusOnSelect: true,
    lazyLoad: "progressive",
    edgeFriction: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    className: "slick-carousel",
  }

  return (
  <Carousel ref={carousel => props.setCarouselRef(carousel)} {...carouselOptions} >
    
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
        starred={props.userMeteorInfo[item.filePath] && props.userMeteorInfo[item.filePath].starred}
        userLabel={props.userMeteorInfo[item.filePath] && props.userMeteorInfo[item.filePath].label}
        toggleStar={() => props.toggleStar(item.filePath)}
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
)};

const cardStyling = {
  position: "relative",
  maxWidth: "80vw",
  background: "rgb(34, 54, 76)",
}

export default ImageCarousel;