import React from 'react'
import { useParams } from 'react-router'
import { showUser } from '../../functionLib/api.js'

function MyFollows() {
  const { userId } = useParams()
  const [follows, setFollows] = React.useState([])


  React.useEffect(() => { 

    async function getCollections(){
      try {
        const result = await showUser(userId)
        if (!result) console.log('there be errors here')
        console.log(result.data.myFollowing !== undefined, result.data.myFollowing)
        // if (result.data.myFollowing !== undefined) {
        //   const followingArray = await result.data.myFollowing.map(async (id) => {
        //     console.log(id)
        //     const user = await showUser(id)
        //     console.log(user.data)
        //     return (user.data)
        //   })
        //   setFollows(followingArray)
        // }
        if ((result.data) && (result.data.myFollowing)) {
          const followings = []
          await result.data.myFollowing.forEach(async (userId, index)=> {
            const resUser = await showUser(userId)
            followings.push({ ...resUser.data })
            if (result.data.myFollowing.length === index + 1) {
              setFollows(followings)
              console.log('followings', followings)
            }
            
          })
        }
        console.log('follows', result.data, follows)
        
      } catch (err) {
        console.log(err)
      }
    }
    getCollections()
  },[])

  React.useEffect(() => {
    console.log('follows', follows)
  },[follows])

  return (
    <>
      <p>Follows:</p>
      {(follows.length > 0) &&
        follows.map(user => {
          return (
            <div key={user._id} >
              <p>{user.username}</p>
            </div>
          )
          
        })
      }
    </>
  )
}


export default MyFollows