import React from 'react'
import { useParams } from 'react-router-dom'

import { getImage, showUser, editUser } from '../../functionLib/api.js'
import { isAuthenticated, getPayload } from '../../functionLib/auth.js'
import ReactMapGL, { Marker } from 'react-map-gl'

function ImageShow() {
  const { imageId } = useParams()
  const [inputs, setInputs] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [madeBy, setMadeBy] = React.useState('')
  const [user, setUser] = React.useState({})
  const [following, setFollowing] = React.useState()
  // const [viewPort, setViewport] = React.useState(

  // )

  const isAuth = isAuthenticated()

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


  React.useEffect(() => {
    const userId = getPayload().sub
    async function compareUser(){
      try {
        const user = await showUser(userId)
        const userData = user.data
        const userToEdit = { ...userData }
        console.log(userToEdit.myFollowing)
        console.log(inputs.addedBy)
        if (userToEdit.myFollowing.includes(`${inputs.addedBy}`)){
          setFollowing(true)
        } else {
          setFollowing(false)
        }
      } catch (err) {
        console.log(err)
      }
    }
    compareUser()  
  },[user])

  async function handleFollow(){
    const userId = getPayload().sub
    try {
      const user = await showUser(userId)
      const userData = user.data
      const userToEdit = { ...userData } 
      console.log(inputs)
      userToEdit.myFollowing.push(inputs.addedBy)
      const editInput = userToEdit.myFollowing
      const editBody = {
        _id: userId,
        myFollows: editInput,  
      }
      const response = await editUser(editBody)
      setFollowing(true)
      console.log(response)
      
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUnFollow(){
    console.log('unfollow')
    const userId = getPayload().sub

    try { 
      const user = await showUser(userId)
      const userData = user.data
      const userToEdit = { ...userData } 
      const filteredArray = userToEdit.myFollowing.filter(follow => {
        return follow !== inputs.addedBy
      })
      const editBody = {
        _id: userId,
        myFollows: filteredArray,  
      }
      const response = await editUser(editBody)
      console.log(response)
      setFollowing(false)
    } catch (err) {
      console.log(err)
    }
  }



  
  return (
    <>
      
      {(inputs) && 
        <div className='imageDataContainer'>
          <div className='imageWrapper'>
            <img src={inputs.url} />
          </div>
          <div className='imageData'>
            <p><strong>{inputs.picName}</strong></p>
            <p><strong>Latitude</strong> {inputs.latitude}</p>
            <p><strong>Longitude</strong> {inputs.longitude}</p>
            <p><strong>Regions</strong> {inputs.tags.locations.join(', ')}</p>
            <p><strong>Types</strong> {inputs.tags.types.join(', ')}</p>
            <p><strong>Tags</strong> {inputs.tags.customs.join(', ')}</p>
            <p><strong>Made By</strong> {madeBy}</p>
            <div className='followButton'>
              { isAuth && 
                <>
                  {!following ? (
                    <button className='button-outline follow' onClick={handleFollow}>
                      {`follow ${madeBy}`}
                    </button>
                  ) : (
                    <button className='button-outline follow' onClick={handleUnFollow}>
                      {`Un-follow ${madeBy}`}
                    </button>
                  )}
                </>
              }
            </div>
            <div className='favouriteButton'>
              {(isAuth) && (!isFavorite) &&
                <div>
                  <button onClick={handleFavorite} className='button-outline favourite'>Favorite</button>
                </div>
              }
              {(isAuth) && (isFavorite) &&
                <div>
                  <button onClick={handleUnfavorite} className='button-outline favourite'>Unfavorite</button>
                </div>
              }
            </div>   
            <div className='mapBox-container'>
              <ReactMapGL
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                height="100%"
                width="100%"
                mapStyle='mapbox://styles/hollylouisarose/cksrc0zi20n2o17q8f17hifcw'
              >
                {inputs &&
                    <Marker
                      key={inputs._id}
                      latitude={inputs.latitude}
                      longitude={inputs.longitude}
                    >
                      <span>📍</span>
                    </Marker>
                }
              </ReactMapGL>
            </div>
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