import React, {useEffect} from 'react'
import axios from 'axios';

const App = () => {
  const [images, setImages] = React.useState([])

  const fetchImages = async () => {
    const when  = new Date().toISOString() 
    const response  = await axios.get(`${window.location.origin}/api/images-by-date?when=${when}`)
    if ( !(response.status==200) ){
      return console.log("ERROR: could not fetch image info: \n", response)
    }
    setImages(response.data)
  }

  useEffect(() => {
    fetchImages()
  }, [])

  return (
    <div>
      App Content
    </div>
  )
}

export default App