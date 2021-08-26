
import React from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { showUser, getImages } from '../../functionLib/api'
import { isAuthenticated, isOwner } from '../../functionLib/auth'
import { editUser } from '../../functionLib/api'
import { getPayload } from '../../functionLib/auth'

function UserShow() {

  const { userId } = useParams()
  const [ userData, setUserData ] = React.useState() 
  const [imageData, setImageData] = React.useState()
  const [filteredData, setFilteredData] = React.useState()
  const [owner, setOwner] = React.useState()
  const [following, setFollowing] = React.useState()
  const [canFollow, setCanFollow] = React.useState()
  const currentUser = getPayload().sub
  const location = useLocation()
  

  console.log(userId)

  React.useEffect(() => {
    const areYouOwner = isOwner(userId)
    const isAuth = isAuthenticated()
    if (areYouOwner && isAuth) {
      setOwner(true)
    } else {
      setOwner(false)
    }
  },[userId])

  React.useEffect(() => {
    
    async function getUserData() {
      try {
        const userData = await showUser(userId)
        if (!userData) return console.log('its fucked')
        setUserData(userData.data)
        console.log(userData)

        const imageData = await getImages()
        if (!imageData) console.log('there are no images')
        setImageData(imageData.data)
        console.log(imageData.data)
        
      } catch (err) {
        console.log(err)
      }
    }
    getUserData()
  }, [userId])

  React.useEffect(() => {
    
    function filterData() {
      const filteredImages = imageData.filter(image => {
        return image.addedBy === userId
      })
      console.log(filteredImages)
      setFilteredData(filteredImages)
      console.log(filteredData)
    }
    
    if (imageData) filterData()

  },[imageData])



  // follow button

  React.useEffect(() => {
    setCanFollow(userId !== currentUser)
  }, [location])

  React.useEffect(() => {
    async function compareUser(){
      try {
        const user = await showUser(currentUser)
        const userData = user.data
        const userToEdit = { ...userData }
        console.log(userToEdit.myFollowing)
        // console.log(inputs.addedBy)
        if (userToEdit.myFollowing.includes(`${userId}`)){
          setFollowing(true)
        } else {
          setFollowing(false)
        }
      } catch (err) {
        console.log(err)
      }
    }
    compareUser()
    setCanFollow(userId !== currentUser)  
  },[location])

  async function handleFollow(){
    try {
      const user = await showUser(currentUser)
      const userData = user.data
      const userToEdit = { ...userData } 
      // console.log(inputs)
      userToEdit.myFollowing.push(userId)
      const editInput = userToEdit.myFollowing
      const editBody = {
        _id: currentUser,
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
    try { 
      const user = await showUser(currentUser)
      const userData = user.data
      const userToEdit = { ...userData } 
      const filteredArray = userToEdit.myFollowing.filter(follow => {
        return follow !== userId
      })
      const editBody = {
        _id: currentUser,
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
      <section className='userShow'>
        <div className='userCard'>
          {!userData ? <h1>loading</h1> : 
            <div>
              <div className='username'>
                <h1>{`${userData.username}`}</h1>
              </div>
              <div className="userInfo">
                <h2><strong>Collections</strong> {userData.myCollections.length}</h2>  
                <h2><strong>Following</strong> {userData.myFollowing.length}</h2>
                {!filteredData ? <h1>loading</h1> :
                  <h2><strong>Uploads</strong> {filteredData.length}</h2>
                }
              </div>
            </div>
          }
          <div>
            {owner && <div><Link to={`/users/${userId}/edit`}>Edit Profile</Link></div>}
            {canFollow &&
              <>
                {!following ? (
                  <button className='button-outline follow' onClick={handleFollow}>
                    follow
                  </button>
                ) : (
                  <button className='button-outline follow' onClick={handleUnFollow}>
                    unfollow
                  </button>
                )}
              </>
            }
          </div>
        </div>
      </section>  
    </>
  )
}

export default UserShow