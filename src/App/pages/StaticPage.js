import React from 'react'
import Background from '../components/Background'
import marked from 'marked'
import Card from '@material-ui/core/Card'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/css/App.css'

const StaticPage = (props) => {
  const [content, setContent] = React.useState("Loading content")
  const pageDataPath = require(`./${props.name}/content.md`)
  
  fetch(pageDataPath)
    .then(response => {
      return response.text()
    })
    .then(text => 
      setContent( marked(text) ) 
    )

  return (
  <main>
    <Background />
    <div className="root__content">
      <h1 style={{textAlign: "center", fontSize: "4rem"}}>
        {props.title}
      </h1>
      <Card style={cardStyling}>
        <article dangerouslySetInnerHTML={{__html: content}}/>
      </Card>
    </div>
  </main>
  )
}

const cardStyling = {
  padding: "2rem 1rem",
  textAlign: "justify",
  lineHeight: "2",
  fontSize: "1.2rem",
  position: "relative",
  width: "95vw",
  maxWidth: "800px",
  background: "rgb(34, 54, 76)",
  margin: "0px auto",
}

export default StaticPage