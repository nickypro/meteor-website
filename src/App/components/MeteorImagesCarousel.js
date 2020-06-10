import React, { useState } from 'react';
import Card from '@material-ui/core/Card'

import Carousel from "react-slick"; 

import MeteorImageCard from './MeteorImageCard';

const ImageCarousel = (props) => {
  const carouselOptions = {
    dots: true,
    speed: 200,
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
    
    <div>
    <div className="center-flex">
      <Card style={cardStyling}>
        <button className="slick-card-button" onClick={props.getEarlier}>
          Load Earlier
        </button>
      </Card>
    </div>
    </div>

    {/* List meteor images */}
    {props.images.map((item, index) => (
      <MeteorImageCard 
        key={`meteor_card_${index}`}
        data={item} 
        starred={props.starred.has(item.filePath)}
        toggleStar={() => props.toggleStar(item.filePath)}
      />
    ))}
    {/* End of Meteor Image List */}
    <div>
    <div className="center-flex">
      <Card style={cardStyling}>
        <button className="slick-card-button" onClick={props.getLater}>
          Load Later
        </button>
      </Card>
    </div>
    </div>
  </Carousel>
)};

const cardStyling = {
  position: "relative",
  maxWidth: "80vw",
  background: "rgb(34, 54, 76)",
}

export default ImageCarousel;