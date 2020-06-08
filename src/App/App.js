import React from 'react'
import {Link as ScrollLink, Element} from 'react-scroll'
import MeteorImageSearch from './components/MeteorImageSearch'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import './assets/css/App.css'
import './assets/css/slick.css'

import { FormHelperText, Button } from '@material-ui/core';

function Background(props) {
  return <div className="background"/>
}

const App = () => {
  return (
  <main>
    <Background />
    <div className="root__content">
      <h1 style={{textAlign: "center", fontSize: "4rem"}}>Meteor Images</h1>
      <ScrollLink to="meteor-images" smooth={true} duration={500}>
        <h1 className="scroll-down-icon">
          &#709;
        </h1>
      </ScrollLink>
    </div>
    <Element name="meteor-images">
      <MeteorImageSearch id="meteor-images"/>
    </Element>
  </main>
  )
}

export default App