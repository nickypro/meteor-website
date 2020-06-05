import React from 'react';
import Card from '@material-ui/core/Card'
import Carousel from '@brainhubeu/react-carousel'

const ImageCarousel = (props) => (
  <Carousel dots arrows slidesPerPage={2} centered clickToChange animationSpeed={200}>
    {props.images.map((item, index) => {
      const path = `${window.location.origin}/images${item.filePath}` 
      return (
        <Card style={cardStyling}>
        <img className="meteor-image" key={index} src={path}/>
        <div style={textMarginStyling}>
          <h2>Meteor Image</h2>
          <ul>
            <li> Taken  : {item.date}   </li>
            <li> Camera : {item.camera} </li>
            <li> info   : meteor        </li>
            <li> link   : <a href={path}> {item.filePath} </a></li>
          </ul>
        </div>
        <br/>
        </Card>
      )}
    )}
  </Carousel>
);

const textMarginStyling = {margin: "1rem 2rem 3rem"}

const cardStyling = {
  width: "80%", 
  maxWidth: "800px", 
  margin: "2rem",
  background: "rgb(34, 54, 76)",
}

export default ImageCarousel;