import React from 'react'
import { useParams } from 'react-router-dom'

import { getImage, showUser, editUser } from '../../functionLib/api.js'
import { isAuthenticated, getPayload } from '../../functionLib/auth.js'

function ImageShow() {
  const { imageId } = useParams()
  const [inputs, setInputs] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [madeBy, setMadeBy] = React.useState('')
  const [user, setUser] = React.useState({})

  React.useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      try {
        const resImage = await getImage(imageId)
        setInputs(resImage.data)
        const resUser = await showUser(resImage.data.addedBy)
        setMadeBy(resUser.data.username)

        const currentUser = await showUser(getPayload().sub)
        setUser(currentUser.data)
        if (currentUser.data.myCollections.length > 0) {
          const favorites = currentUser.data.myCollections[0].collectionArray
          setIsFavorite(favorites.join(',').includes(imageId))
        }
        console.log(resImage.data)
        console.log(resUser.data)
        console.log(currentUser.data)
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    }
    getData()
  }, [imageId])
  
  async function handleFavorite(e) {
    e.preventDefault()
    try {
      const newUser = { ...user }
      if (user.myCollections.length === 0) {
        newUser.myCollections.push({ collectionName: 'Favorites', collectionArray: [] })
      }
      newUser.myCollections[0].collectionArray.push(imageId)
      console.log(newUser)
      const edit = await editUser(newUser)
      console.log(edit)
      setIsFavorite(true)
    } catch (err) {
      console.log(err)
    }
  }
  async function handleUnfavorite() {
    try {
      const newUser = { ...user }
      
      if (user.myCollections.length === 0) {
        newUser.myCollections.push({ collectionName: 'Favorites', collectionArray: [] })
      } 
      const newCollections = newUser.myCollections[0].collectionArray.filter(image => {
        return (image !== imageId)
      })
      newUser.myCollections[0].collectionArray = newCollections
      await editUser(newUser)
      setIsFavorite(false)
    } catch (err) {
      console.log(err)
    }
  }
  
  return (
    <>
      <h1>Image Show:</h1>
      {(isAuthenticated) && (!isFavorite) &&
        <div>
          <button onClick={handleFavorite} >Favorite</button>
        </div>
      }
      {(isAuthenticated) && (isFavorite) &&
        <div>
          <button onClick={handleUnfavorite} >Unfavorite</button>
        </div>
      }
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