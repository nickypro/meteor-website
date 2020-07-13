import React from 'react'
import Background from '../components/Background'
import marked from 'marked'
import Card from '@material-ui/core/Card'

import {useLocaleStateUserMeteorInfo } from '../functions/hooks'

import {Link as ScrollLink, Element} from 'react-scroll'
import PageDots from '../components/PageDots'
import MeteorImageSearch from '../components/MeteorImageSearch'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/css/slick.css'

import '../assets/css/App.css'

const subsections = require('./home/subsections.json')

const App = () => {
  const [userMeteorInfo, setUserMeteorInfo, toggleStar, setLabel] = 
    useLocaleStateUserMeteorInfo("user_selections");

  const [intro, setIntro] = React.useState("Loading content")
  const introDataPath = require(`./home/intro.md`)
  
  const [content, setContent] = React.useState("Loading content")
  const contentDataPath = require(`./home/content.md`)
    
  fetch(contentDataPath)
    .then(response => {
      return response.text()
    })
    .then(text => 
      setContent( marked(text) ) 
    )
  
  fetch(introDataPath)
    .then(response => {
      return response.text()
    })
    .then(text => 
      setIntro( marked(text) ) 
    )

  return (
  <main>
    <Background />
    <PageDots pages={subsections}/>
    
    <Element name="title">
      <div className="root__content">
        <h1 style={{textAlign: "center", fontSize: "4rem"}}>Meteor Images</h1>
        <ScrollLink to={subsections[1].id} smooth={true} duration={500}>
          <h1 className="scroll-down-icon"> &#709; </h1>
        </ScrollLink>
      </div>
    </Element>

    <Element>
      <Card style={cardStyling}>
        <article dangerouslySetInnerHTML={{__html: intro}}/>
      </Card>
    </Element>

    <Element name="meteor-images" id="meteor-images">
      <MeteorImageSearch 
        userMeteorInfo={userMeteorInfo} 
        toggleStar={toggleStar} 
        setLabel={setLabel}
      />
    </Element>
    
    <Element>
      <Card style={cardStyling}>
        <article dangerouslySetInnerHTML={{__html: content}}/>
      </Card>
    </Element>

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

export default App