import React from 'react'
import Card from '@material-ui/core/Card'
import dateFormat from 'dateformat'
import LabelPicker from './LabelPicker'

const path = require('path')

const config = require('../../config.json')
const imageDomain = config.imageDomain || window.location.origin
const imagePath = config.imageUrl || "images"
const imgUrl = path.join(imageDomain, imagePath)

const MeteorImageCard = (props) => {
  const imgPath = path.join(imgUrl, props.data.filePath) 
  const cam = config.cameras[props.data.camera] || props.data.camera
  const label = props.data.label || "Unlabeled"
  return (
  <div>
  <div style={{display: "flex", flexDirection: "column", margin: "1rem"}}>
    
    <div style={{fontSize: "1.5rem", display: "flex", justifyContent: "space-between"}}>
      <span style={{textAlign: "left" }}> {dateFormat(props.data.date, "d mmm yyyy")} </span>
      <span style={{textAlign: "right"}}> {dateFormat(props.data.date, "hh:MM:ss")} </span>
    </div>

    <Card style={cardStyling}>
    <a href={imgPath} target="_blank">
      <img className="meteor-image" src={imgPath}/>
    </a>
    <button 
      id={`button_${props.data.filePath}`}
      className={`slick-star ${props.starred ? "starred" : ""}`} 
      onClick={props.toggleStar}
      htmlFor="favourite meteor"
      > 
      &#9733;
    </button>
    <div style={textMarginStyling}>
      <h2 style={{textAlign: "center"}}>{cam} - {label}</h2>
      <ul>
        {props.data.info && 
          <li>{props.data.info}</li>
        }
      </ul>
      <LabelPicker 
        imageId={props.data.filePath}
        submit={props.sendLabel}
        disabled={!!props.userLabel}
        value={props.userLabel ? props.userLabel : undefined}
      />
    </div>
    <br/>
    </Card>

  </div>
  </div>
  )
}

const textMarginStyling = {width: "80%", margin: "0px auto"}

const cardStyling = {
  position: "relative",
  maxWidth: "90vw",
  background: "rgb(34, 54, 76)",
  margin: "0px auto",
}

export default MeteorImageCard