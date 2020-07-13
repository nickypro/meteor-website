import React, { useEffect } from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import {Link as ScrollLink} from 'react-scroll'
import "../assets/css/PageDots.css"

const pagesToDots = (pages, visible) => {
  return pages.map((page, index) => 
    ({ ...page, isCurrent: visible.has(page.id) })
  )
}

const PageDots = (props) => {
  const [hideText, setHideText] = React.useState(false)
  const [dots, setDots] = React.useState( pagesToDots(props.pages, props.visible) )
  
  useScrollPosition( ({ prevPos, currPos }) => {
    let yNew = - currPos.y;
    
    if (window.innerWidth > 1000 | yNew < 10) {
      if (hideText)  setHideText(false)

    } else {
      if (!hideText) setHideText(true)

    }

    const tempDots = pagesToDots(props.pages, props.visible)
    setDots(tempDots)

  })

  return (
  <div className="side-dot-container">
    {dots.map((dot, index) =>
      <div key={`dot_${index}`}>
        <ScrollLink to={dot.id} smooth={true} duration={500}>
          <div className="side-dot" style={(dot.isCurrent ? {opacity: 1} : {})}>
            <span style={hideText ? {display: "none"} : {}}>
              {dot.section}
            </span>
          </div>
        </ScrollLink>
      </div>
    )}
  </div>
  )
}

export default PageDots