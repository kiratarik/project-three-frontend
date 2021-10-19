import React from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import { getImage, showUser, editUser } from '../../functionLib/api.js'
import { isAuthenticated, getPayload, isOwner } from '../../functionLib/auth.js'
import ReactMapGL, { Marker } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default

function ImageShow() {
  const { imageId } = useParams()
  const history = useHistory()
  const [inputs, setInputs] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [madeBy, setMadeBy] = React.useState('')
  const [user, setUser] = React.useState({})
  const [following, setFollowing] = React.useState()

  const [viewport, setViewport] = React.useState({
    zoom: 5,
  })

  const isAuth = isAuthenticated()
  const [isYou, setIsYou] = React.useState(false)

  React.useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      try {
        const resImage = await getImage(imageId)
        setInputs(resImage.data)
        const resUser = await showUser(resImage.data.addedBy)
        setMadeBy(resUser.data.username)
        const isMe = await isOwner(resUser.data._id)
        setIsYou(isMe)
        const currentUser = await showUser(getPayload().sub)
        setUser(currentUser.data)
        if (currentUser.data.myCollections.length > 0) {
          const favorites = currentUser.data.myCollections[0].collectionArray
          setIsFavorite(favorites.join(',').includes(imageId))
        }
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
      await editUser(newUser)
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
  })

  async function handleFollow(){
    const userId = getPayload().sub
    try {
      const user = await showUser(userId)
      const userData = user.data
      const userToEdit = { ...userData } 
      userToEdit.myFollowing.push(inputs.addedBy)
      const editInput = userToEdit.myFollowing
      const editBody = {
        _id: userId,
        myFollows: editInput,  
      }
      await editUser(editBody)
      setFollowing(true)
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUnFollow(){
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
      await editUser(editBody)
      setFollowing(false)
    } catch (err) {
      console.log(err)
    }
  }

  function handleEdit() {
    history.push(`/images/${imageId}/edit`)
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
            <p><strong>Made By</strong> <Link  to={`/users/${inputs.addedBy}/pictures`}> <a className='userPageLink' href=''>{madeBy}</a></Link> </p>
            <div className='followButton'>
              { isAuth && !isYou &&
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
              { isAuth && isYou &&
                <>
                  <button className='button-outline follow' onClick={handleEdit}>
                    Edit
                  </button>
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
                mapStyle='mapbox://styles/mapbox/streets-v11'
                // mapStyle='mapbox://styles/hollylouisarose/cksrc0zi20n2o17q8f17hifcw'
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
                {...viewport}
                latitude={inputs.latitude}
                longitude={inputs.longitude}
                pitch={0}
                bearing={0}
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