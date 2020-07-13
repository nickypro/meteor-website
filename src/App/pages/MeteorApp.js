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

import VisibilitySensor from 'react-visibility-sensor'
/*
function Element (props) {
  return (
    <VisibilitySensor onChange={onChange}>
      <div>...content goes here...</div>
    </VisibilitySensor>
  );
}
/**/

const subsections = require('./home/subsections.json')

const App = () => {
  const [userMeteorInfo, setUserMeteorInfo, toggleStar, setLabel] = 
    useLocaleStateUserMeteorInfo("user_selections");

  const [intro, setIntro] = React.useState("Loading content")
  const introDataPath = require(`./home/intro.md`)
  
  const [contentList, setContentList] = React.useState(["Loading content"])
  const contentDataPath = require(`./home/content.md`)
  
  React.useEffect(() => {

    fetch(contentDataPath)
      .then(response => {
        return response.text()
      })
      .then(text => {
        const blocks = text.split(/(?=\n[a-zA-Z0-9\-\s_]+\n-------+)/)
          .filter(str => str.length > 1)
          .map(text => marked(text))

        blocks.forEach(item => console.log(item))

        setContentList( blocks ) 
      })
    
    fetch(introDataPath)
      .then(response => {
        return response.text()
      })
      .then(text => 
        setIntro( marked(text) ) 
      )
    
    },[]
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
    
    {contentList.map(content =>
    <Element>
      <Card style={cardStyling}>
        <article dangerouslySetInnerHTML={{__html: content}}/>
      </Card>
    </Element>
    )}

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
  margin: "1rem auto",
}

export default App