import React from 'react';
import Card from '@material-ui/core/Card'

import Carousel from "react-slick"; 

import dateFormat from 'dateformat'

const options = {
  dots: true,
  speed: 200,
  infinite: false,
  centerMode: true,
  focusOnSelect: true,
  lazyLoad: "progressive",
  edgeFriction: 0,
  slidesToShow: 1,
  slidesToScroll: 1,
  style: {width: "100%", maxWidth: "500px", overflowX: "show"}
}

const ImageCarousel = (props) => (
  <Carousel {...options} >
    {props.images.map((item, index) => {
      const path = `${window.location.origin}/images${item.filePath}` 
      return (
      <div>
      <div style={{display: "flex", flexDirection: "column", margin: "1rem"}}>
        <div style={{fontSize: "1.5rem", display: "flex", justifyContent: "space-between"}}>
          <span style={{textAlign: "left" }}> {dateFormat(item.date, "d mmm yyyy")} </span>
          <span style={{textAlign: "right"}}> {dateFormat(item.date, "hh:MM:ss")} </span>
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
  </Carousel>
);

const textMarginStyling = {width: "80%", margin: "0px auto"}

const cardStyling = {
  maxWidth: "80vw",
  background: "rgb(34, 54, 76)",
}

export default ImageCarousel;