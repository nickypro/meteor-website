import React from 'react'
import Background from '../components/Background'

import {useLocaleStateUserMeteorInfo } from '../functions/hooks'

import {Link as ScrollLink, Element} from 'react-scroll'
import PageDots from '../components/PageDots'
import MeteorImageSearch from '../components/MeteorImageSearch'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/css/slick.css'

import '../assets/css/App.css'

const subsections = [{ 
    section: "Title",
    id: "title",
  },{
    section: "Images",
    id: "meteor-images",
  }
]

const App = () => {
  const [userMeteorInfo, setUserMeteorInfo, toggleStar, setLabel] = 
    useLocaleStateUserMeteorInfo("user_selections");

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

    <Element name="meteor-images" id="meteor-images">
      <MeteorImageSearch 
        userMeteorInfo={userMeteorInfo} 
        toggleStar={toggleStar} 
        setLabel={setLabel}
      />
    </Element>
    
  </main>
  )
}

export default App