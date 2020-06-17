import React from 'react'
import Card from '@material-ui/core/Card'
import dateFormat from 'dateformat'
import LabelPicker from './LabelPicker'

const MeteorImageCard = (props) => {
  const path = `${window.location.origin}/images${props.data.filePath}` 
  
  return (
  <div>
  <div style={{display: "flex", flexDirection: "column", margin: "1rem"}}>
    
    <div style={{fontSize: "1.5rem", display: "flex", justifyContent: "space-between"}}>
      <span style={{textAlign: "left" }}> {dateFormat(props.data.date, "d mmm yyyy")} </span>
      <span style={{textAlign: "right"}}> {dateFormat(props.data.date, "hh:MM:ss")} </span>
    </div>

    <Card style={cardStyling}>
    <a href={path} target="_blank">
      <img className="meteor-image" src={path}/>
    </a>
    <button 
      id={`button_${props.data.filePath}`}
      className={`slick-star ${props.starred ? "starred" : ""}`} 
      onClick={props.toggleStar}
      for="favourite meteor"
      > 
      &#9733;
    </button>
    <div style={textMarginStyling}>
      <h2 style={{textAlign: "center"}}>{props.data.label || "Meteor Image"}</h2>
      <ul>
        <li> Cam  : {props.data.camera} </li>
        <li> Label: {props.data.label || "unlabeled"}  </li>
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
  maxWidth: "80vw",
  background: "rgb(34, 54, 76)",
}

export default MeteorImageCard