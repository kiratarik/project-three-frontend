
import React from 'react'
import { useParams } from 'react-router-dom'
import { showUser, getImages } from '../../functionLib/api'

function UserShow() {

  const { userId } = useParams()
  const [ userData, setUserData ] = React.useState() 
  const [imageData, setImageData] = React.useState()

  console.log(userId)

  

  React.useEffect(() => {

    async function getUserData() {
      try {
        const userData = await showUser(userId)
        if (!userData) return console.log('its fucked')
        setUserData(userData.data)
        console.log(userData)

        const imageData = await getImages()
        if (!imageData) console.log('there are no images')
        console.log(imageData)
        setImageData(imageData.data)
        

      } catch (err) {
        console.log(err)
      }
    }
    getUserData()
  }, [userId])

  return (
    <>
      {!userData ? <h1>loading</h1> : 
        <div>
          <h1>{`${userData.userName}`}</h1>
          <h2>{`Collections: ${userData.collections.length}`}</h2>  
          <h2>{`Following: ${userData.following.length}`}</h2>
          
        </div>
      }
      {!imageData ? <h1>loading</h1> :
        <>
          <h2>{`Uploads: ${imageData.length}`}</h2>
        </>
      }
    </>
  )
}

export default UserShow