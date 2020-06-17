import React from 'react'
import Background from './components/Background'

import {useLocaleStateUserMeteorInfo } from './functions/hooks'

import {Link as ScrollLink, Element} from 'react-scroll'
import PageDots from './components/PageDots'
import MeteorImageSearch from './components/MeteorImageSearch'
import MeteorImageFeatured from './components/MeteorImageFeatured'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import './assets/css/App.css'
import './assets/css/slick.css'

const pages = [{ 
    section: "Title",
    id: "title",
  },{
    section: "Images",
    id: "meteor-images",
  },{
    section: "List",
    id: "meteor-images-list",
  }
]

const App = () => {
  const [userMeteorInfo, setUserMeteorInfo, toggleStar, setLabel] = 
    useLocaleStateUserMeteorInfo("user_selections");

  return (
  <main>
    <Background />
    <PageDots pages={pages}/>
    
    <Element name="title">
      <div className="root__content">
        <h1 style={{textAlign: "center", fontSize: "4rem"}}>Meteor Images</h1>
        <ScrollLink to={pages[1].id} smooth={true} duration={500}>
          <h1 className="scroll-down-icon"> &#709; </h1>
        </ScrollLink>
      </div>
    </Element>

    <MeteorImageSearch id="meteor-images" 
      userMeteorInfo={userMeteorInfo} 
      toggleStar={toggleStar} 
      setLabel={setLabel}
    />
    
  </main>
  )
}

export default App