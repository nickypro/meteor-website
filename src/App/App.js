import React from 'react'
import MeteorImageSearch from './components/MeteorImageSearch'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './App.css'

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
    </div>
    <MeteorImageSearch id="meteors"/>
  </main>
  )
}

export default App