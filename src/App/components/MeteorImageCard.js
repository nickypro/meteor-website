import React from 'react'
import Card from '@material-ui/core/Card'
import dateFormat from 'dateformat'
import LabelPicker from './LabelPicker'

const path = require('path')

const config = require('../../config.json')
const imageDomain = config.imageDomain || window.location.origin
const imagePath = config.imagePath || "images"
const imgUrl = path.join(imageDomain, imagePath)

/*
// Usage: 
<MeteorImageCard 
  data={item} //object
  starred={props.userMeteorInfo[item.fileName].starred} //boolean
  userLabel={props.userMeteorInfo[item.fileName].label} //string
  toggleStar={() => props.toggleStar(item.fileName)} //string
  sendLabel={props.sendLabel} //callback function
/>

// we note that here,
data = {
  camera,
  label,
  filePath,
  fileName,
  ...
}
*/

{/* A visual card that shows each meteor */}
const MeteorImageCard = (props) => {
  const imgPath = path.join(imgUrl, props.data.filePath) 
  const cam = config.cameras[props.data.camera] || props.data.camera
  const label = props.data.label || "Unlabeled"
  console.log(imgPath)
  return (
  <div>
  <div style={{display: "flex", flexDirection: "column", margin: "1rem"}}>
    
    {/* The text above that shows date and time */}
    <div style={{fontSize: "1.5rem", display: "flex", justifyContent: "space-between"}}>
      <span style={{textAlign: "left" }}> {dateFormat(props.data.date, "d mmm yyyy")} </span>
      <span style={{textAlign: "right"}}> {dateFormat(props.data.date, "HH:MM:ss")} </span>
    </div>

    {/* The card itself with the image and more information */}
    <Card style={cardStyling}>
    {/*Clicking the image links to the image on meteor-data.ap.dias.ie */}
    <a href={imgPath} target="_blank">
      <img className="meteor-image" src={imgPath}/>
    </a>
    {/* The button that leaves a "like" on the image */}
    <button 
      id={`button_${props.data.fileName}`}
      className={`slick-star ${props.starred ? "starred" : ""}`} 
      onClick={props.toggleStar}
      htmlFor="favourite meteor"
      > 
      &#9733;
    </button>
    {/* Info on the image (current label) */}
    <div style={textMarginStyling}>
      <h2 style={{textAlign: "center"}}>{cam} - {label}</h2>
      <ul>
        {props.data.info && 
          <li>{props.data.info}</li>
        }
      </ul>
      {/* We allow the user to input a label for the image */}
      <LabelPicker 
        imageId={props.data.fileName}
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