import React from 'react'
import { useParams } from 'react-router-dom'

import { getImage, showUser } from '../../functionLib/api.js'

function ImageShow() {
  const { imageId } = useParams()
  const [inputs, setInputs] = React.useState(null)
  const [madeBy, setMadeBy] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      try {
        const resImage = await getImage(imageId)
        setInputs(resImage.data)
        const resUser = await showUser(resImage.data.addedBy)
        setMadeBy(resUser.data.userName)
        console.log(resImage.data)
        console.log(resUser.data)
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    }
    getData()
  }, [imageId])
  

  
  return (
    <>
      <h1>Image Show:</h1>
      {(inputs) && 
        <div>
          <div>
            <img src={inputs.url} />
          </div>
          <div>
            <p>Name: {inputs.picName}</p>
            <p>Latitude: {inputs.latitude}</p>
            <p>Longitude: {inputs.longitude}</p>
            <p>Regions: {inputs.tags.locations.join(', ')}</p>
            <p>Types: {inputs.tags.types.join(', ')}</p>
            <p>Tags: {inputs.tags.customs.join(', ')}</p>
            <p>Made By: {madeBy}</p>
          </div>
        </div> 
      }
      {(isLoading) &&
        <div>
          <p>...Loading</p>
        </div>
      }
      { (!inputs) && (!isLoading) &&
        <div>
          <p>Invalid Image ID: Try another Url!</p>
        </div>
      }
    </>
  )
}

export default ImageShow