import React from 'react'
import Background from './components/Background'

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
    section: "Featured",
    id: "meteor-images-featured",
  },{
    section: "Search",
    id: "meteor-images-search",
  }
]

const App = () => {
  return (
  <main>
    <Background />
    <PageDots pages={pages}/>
    <Element name="title">
      <div className="root__content">
        <h1 style={{textAlign: "center", fontSize: "4rem"}}>Meteor Images</h1>
        <ScrollLink to="meteor-images-featured" smooth={true} duration={500}>
          <h1 className="scroll-down-icon"> &#709; </h1>
        </ScrollLink>
      </div>
    </Element>
    <Element name="meteor-images-featured">
      <MeteorImageFeatured id="meteor-images-featured"/>
    </Element>
    <Element name="meteor-images-search">
      <MeteorImageSearch id="meteor-images-search"/>
    </Element>
  </main>
  )
}

export default App