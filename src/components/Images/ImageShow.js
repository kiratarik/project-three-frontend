import React from 'react'
import { useParams } from 'react-router-dom'

function ImageShow({ arrayImages }) {
  const [currentImage, setCurrentImage] = React.useState({})
  const { imageId } = useParams()

  React.useEffect(() => {
    setCurrentImage(arrayImages.filter(item => {
      return (item === imageId)
    })[0])
    console.log(arrayImages)
    console.log(currentImage)
  }, [])
  
  return (
    <>
      <h1>Image Show:</h1>
      {currentImage && 
        <div>
          <p>{currentImage.caption}</p>
        </div>
      }
    </>
  )
}

export default ImageShow