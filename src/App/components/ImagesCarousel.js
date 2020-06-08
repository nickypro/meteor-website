import React, { useState } from 'react';
import Card from '@material-ui/core/Card'

import Carousel from "react-slick"; 

import dateFormat from 'dateformat'


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
    style: {width: "100%", maxWidth: "500px", overflowX: "show"},
  }

  return (
  <Carousel ref={carousel => props.setCarouselRef(carousel)} {...carouselOptions} >
    
    <div>
    <div className="center-flex">
      <Card style={cardStyling}>
        <button style={buttonStyling} onClick={props.getEarlier}>
          Load Earlier
        </button>
      </Card>
    </div>
    </div>

    {/* List meteor images */}
    {props.images.map((item, index) => {
      const path = `${window.location.origin}/images${item.filePath}` 
      return (
      <div>
      <div style={{display: "flex", flexDirection: "column", margin: "1rem"}}>
        
        <div style={{fontSize: "1.5rem", display: "flex", justifyContent: "space-between"}}>
          <span style={{textAlign: "left" }}> {dateFormat(item.date, "d mmm yyyy", true)} </span>
          <span style={{textAlign: "right"}}> {dateFormat(item.date, "hh:MM:ss", true)} </span>
        </div>

        <Card style={cardStyling}>
        <a href={path}>
          <img className="meteor-image" key={index} src={path}/>
        </a>
        <div style={textMarginStyling}>
          <h2 style={{textAlign: "center"}}>Meteor Image</h2>
          <ul>
            <li> Cam  : {item.camera} </li>
            <li> info : meteor     </li>
          </ul>
        </div>
        <br/>
        </Card>

      </div>
      </div>
      )}
    )}
    {/* End of Meteor Image List */}
    <div>
    <div className="center-flex">
      <Card style={cardStyling}>
        <button style={buttonStyling} onClick={props.getLater}>
          Load Later
        </button>
      </Card>
    </div>
    </div>
  </Carousel>
)};

const textMarginStyling = {width: "80%", margin: "0px auto"}

const cardStyling = {
  maxWidth: "80vw",
  background: "rgb(34, 54, 76)",
}

const buttonStyling = {
  margin: "2rem 3rem", 
  background: "rgba(0, 0, 0, 0.2)", 
  border: "none"
}

export default ImageCarousel;