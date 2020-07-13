import React from 'react'
import {Element} from 'react-scroll'
import VisibilitySensor from 'react-visibility-sensor'

function ScrollElement (props) {
  return (
    <Element name={props.name}>
      <VisibilitySensor 
        partialVisibility={true}
        onChange={(isVisible) => props.onChange(props.name, isVisible)}
        >
        {props.children}
      </VisibilitySensor>
    </Element>
  );
}

export default ScrollElement