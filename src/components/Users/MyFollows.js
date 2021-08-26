import React from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { showUser } from '../../functionLib/api.js'

function MyFollows() {
  const { userId } = useParams()
  const [follows, setFollows] = React.useState([])
  const history = useHistory()

  React.useEffect(() => { 

    async function getCollections(){
      try {
        const result = await showUser(userId)
        if ((result.data) && (result.data.myFollowing)) {
          const followings = []
          await result.data.myFollowing.forEach(async (userId, index)=> {
            const resUser = await showUser(userId)
            followings.push({ ...resUser.data })
            if (result.data.myFollowing.length === index + 1) {
              setFollows(followings)
            }
            
          })
        }
        
      } catch (err) {
        console.log(err)
      }
    }
    getCollections()
  }, [userId])

  function handleFollow(e) {
    history.push(`/users/${e.target.id}`)
  }

  return (
    <>
      <p>Follows:</p>
      {(follows.length > 0) &&
        follows.map(user => {
          return (
            <div key={user._id} onClick={handleFollow} >
              <p id={user._id} >{user.username}</p>
            </div>
          )
          
        })
      }
    </>
  )
}


export default MyFollows