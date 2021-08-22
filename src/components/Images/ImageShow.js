import React from 'react'
import { useParams } from 'react-router-dom'

function ImageShow() {
  const { imageId } = useParams()
  const [inputs, setInputs] = React.useState({})
  const [madeBy, setMadeBy] = React.useState('')
  
  const images = [
    {
      id: 'test1',
      caption: 'Image 1',
      latitude: 51,
      longitude: 1,
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/France_manche_vue_dover.JPG',
      tags: { 
        locations: ['Europe','United Kingdom', 'Strait of Dover'],
        types: ['Cliff', 'Ocean'],
        customs: ['The Channel'],
      },
      addedBy: 'userId1',
    }
  ]

  const users = [
    {
      id: 'userId1',
      username: 'Tarik',
    }
  ]

  React.useEffect(() => {
    const inputsArray = images.filter(item => {
      return imageId === item.id
    })

    if (inputsArray.length > 0) {
      setInputs(inputsArray)

      const userArray = users.filter(item => {
        return inputsArray[0].addedBy === item.id
      })
      if (userArray.length > 0) {
        setMadeBy(userArray[0].username)
      } else {
        setMadeBy('')
      }
    } else {
      setInputs({})
      setMadeBy('')
    }
  }, [])
  
  return (
    <>
      <h1>Image Show:</h1>
      {(inputs.length > 0) ? 
        <div>
          <div>
            <img src={inputs[0].url} />
          </div>
          <div>
            <p>Caption: {inputs[0].caption}</p>
            <p>Latitude: {inputs[0].latitude}</p>
            <p>Longitude: {inputs[0].longitude}</p>
            <p>Regions: {inputs[0].tags.locations.join(', ')}</p>
            <p>Types: {inputs[0].tags.types.join(', ')}</p>
            <p>Tags: {inputs[0].tags.customs.join(', ')}</p>
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