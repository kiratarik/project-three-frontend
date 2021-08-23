import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function ImageShow() {
  const baseUrl = '/api'
  const { imageId } = useParams()
  const [inputs, setInputs] = React.useState(null)
  const [madeBy, setMadeBy] = React.useState('')

  React.useEffect(() => {
    const getData = async () => {
      try {
        const resImage = await axios.get(`${baseUrl}/images/${imageId}`)
        setInputs(resImage.data)
        const resUser = await axios.get(`${baseUrl}/users/${resImage.data.addedBy}`)
        setMadeBy(resUser.data.userName)
        console.log(resImage.data)
        console.log(resUser.data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [imageId])
  

  
  return (
    <>
      <h1>Image Show:</h1>
      {(inputs) ? 
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
        : 
        <div>
          <p>Invalid Image ID: Try another Url!</p>
        </div>
      }
    </>
  )
}

export default ImageShow