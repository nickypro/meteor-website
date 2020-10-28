import React from 'react'
import Background from '../components/Background'
import marked from 'marked'
import Card from '@material-ui/core/Card'

import {useLocaleStateUserMeteorInfo } from '../functions/hooks'

import {Link as ScrollLink} from 'react-scroll'
import ScrollElement from '../components/ScrollElement'
import PageDots from '../components/PageDots'
import MeteorImageSearch from '../components/MeteorImageSearch'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/css/slick.css'

import '../assets/css/App.css'

const config = require('../../config.json')
const subsections = require('../../subsections.json')
const path = require('path')
const homepage = config.homepage || "/"

const getId = (text) => text.match(/id="(.*)"+?/) && text.match(/id="(.*)"+?/)[1]

const App = () => {
  const [userMeteorInfo, setUserMeteorInfo, toggleStar, setLabel] = 
    useLocaleStateUserMeteorInfo("user_selections");

  const introDataPath   = path.join(homepage, `/home/intro.md`)
  const contentDataPath = path.join(homepage, `/home/content.md`)
  
  const [introList, setIntroList] = React.useState(["Loading intro content"])  
  const [contentList, setContentList] = React.useState(["Loading content"])

  const [visibleSet, setVisibleSet] = React.useState(new Set())

  // this keeps an eye on the scrolling of the user
  // if a new section is visible or no longer visible
  // then the section is added or removes from the list
  function handleVisChange(name, isVisible) {
    console.log(name, isVisible)
    const tempSet = visibleSet
    if (isVisible) {
      tempSet.add(name)
    } else {
      tempSet.delete(name)
    }
    setVisibleSet(tempSet)
    console.log(tempSet)
  }

  React.useEffect(() => {
    // render the static content split into blocks by ---------
    fetch(contentDataPath)
      .then(response => {
        return response.text()
      })
      .then(text => {
        const blocks = text.split(/\n(?=.+\n-------+)/)
          .filter(str => str.length > 1)
          .map(text => marked(text))

        setContentList( blocks ) 
      
      })
    
    // render the intro static content above the images 
    fetch(introDataPath)
      .then(response => {
        return response.text()
      })
      
      .then(text => {
        const blocks = text.split(/\n(?=.+\n-------+)/)
          .filter(str => str.length > 1)
          .map(text => marked(text))

        setIntroList( blocks ) 
      })
    
    },[]
  )
  
  return (
  <main>
    <Background />
    {/* The dots that track scrolling in sections of the page */}
    <PageDots pages={subsections} visible={visibleSet}/>
    
    {/* The top section of the page*/}
    <ScrollElement name="title" onChange={handleVisChange}>
      <div className="root__content">
        <h1 style={{textAlign: "center", fontSize: "4rem"}}>
          {config.title || "Meteor Images"}
        </h1>
        <ScrollLink to={subsections[1].id} smooth={true} duration={500}>
          <h1 className="scroll-down-icon"> &#709; </h1>
        </ScrollLink>
      </div>
    </ScrollElement>

    {/* The actual images viewer of the page*/}
    <ScrollElement name="meteor-images" onChange={handleVisChange} id="meteor-images" >
      <MeteorImageSearch 
        userMeteorInfo={userMeteorInfo} 
        toggleStar={toggleStar} 
        setLabel={setLabel}
      />
    </ScrollElement>
    
    {/* the introductionary static content*/}
    {introList.map(content =>
    <ScrollElement name={ getId(content) } onChange={handleVisChange}>
      <Card style={cardStyling}>
        <article dangerouslySetInnerHTML={{__html: content}}/>
      </Card>
    </ScrollElement>
    )}

    {/* The static content at the end of the page */}
    {contentList.map(content =>
    <ScrollElement name={ getId(content) } onChange={handleVisChange}>
      <Card style={cardStyling}>
        <article dangerouslySetInnerHTML={{__html: content}}/>
      </Card>
    </ScrollElement>
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
