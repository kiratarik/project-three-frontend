
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { showUser, getImages } from '../../functionLib/api'
import { isAuthenticated, isOwner } from '../../functionLib/auth'


function UserShow() {

  const { userId } = useParams()
  const [ userData, setUserData ] = React.useState() 
  const [imageData, setImageData] = React.useState()
  const [filteredData, setFilteredData] = React.useState()
  const [owner, setOwner] = React.useState()

  

  console.log(userId)

  React.useEffect(() => {
    const areYouOwner = isOwner(userId)
    const isAuth = isAuthenticated()
    if (areYouOwner && isAuth) {
      setOwner(true)
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



  return (
    <>
      <section className='userShow'>
        <div className='userCard'>
          {!userData ? <h1>loading</h1> : 
            <div>
              <div className='username'>
                <h1>{`${userData.username}`}</h1>
              </div>
              <h2>{`Collections: ${userData.myCollections.length}`}</h2>  
              <h2>{`Following: ${userData.myFollowing.length}`}</h2>
            </div>
          }
          {!filteredData ? <h1>loading</h1> :
            <>
              <h2>{`Uploads: ${filteredData.length}`}</h2>
            </>
          }
          <div>
            {owner && <div><Link to={`/users/${userId}/edit`}>Edit Profile</Link></div>}
          </div>
        </div>
      </section>  
    </>
  )
}

export default UserShow