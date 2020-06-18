import React from 'react'
import dateFormat from 'dateformat'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';

const config = require('../../../config.json')
const imageDomain = config.imageDomain || window.location.origin
const imagePath = config.imageUrl || "images"
const imgUrl = `${imageDomain}/${imagePath}`

const ListDialog = (props) => {
  const handleClose = () => {
    props.onClose()
  }

  const changeIndex = (index) => {
    props.setIndex(null, index)
    handleClose()
  }

  return (
  <Dialog 
    open={props.open} 
    handleClose={handleClose}
    onBackdropClick={handleClose}
    >
    <DialogTitle id="simple-dialog-title" style={cardStyling}>
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
      List of Images
    </DialogTitle>
    <DialogContent 
      dividers={scroll === 'paper'} 
      style={{...cardStyling, borderTop: "1px solid rgba(0, 0, 0, 0.3)"}}
      >
    
      <List> 
        {props.images.map((img, i) => {
          const index = i + 1
          return (
            <div key={`list_${index}`}>
              <ListItem 
                button 
                className="meteor-list-item"
                onClick={() => changeIndex(index)}
                >
                {index === props.index ? ' \u2B24 ' : ""}
                {dateFormat(img.date, 'yyyy mmm dd - hh:MM:ss ')}
                {img.label || "unlabeled"} 
              </ListItem> 
            </div>
          ) 
        })
        }
      </List>
    
    </DialogContent>

  </Dialog>
)}

const cardStyling = {
  background: "rgb(34, 54, 76)",
}

export default ListDialog