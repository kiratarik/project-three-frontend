import React from 'react'
import { useParams } from 'react-router-dom'

function ImageShow() {
  const { imageId } = useParams()
  React.useEffect(() => {
    console.log(imageId)
  }, [])
  
  return (
    <>
      <h1>Image Show:</h1>
      
    </>
  )
}

export default ImageShow