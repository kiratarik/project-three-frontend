import React from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { showUser } from '../../functionLib/api.js'

function MyFollows() {
  const { userId } = useParams()
  const [follows, setFollows] = React.useState([])
  const [followsTwo, setFollowsTwo] = React.useState([])
  const [followsThree, setFollowsThree] = React.useState([])
  const history = useHistory()

  React.useEffect(() => { 
    getCollections()
  }, [userId])

  React.useEffect(() => {
    console.log('follows', follows)
  }, [follows])
  React.useEffect(() => {
    console.log('followsTwo', followsTwo)
    let isComplete = true
    for (var i = 0; i < followsTwo.length; i++) {
      if (typeof followsTwo[i] === 'undefined') {
        isComplete = false
        i = followsTwo.length
      }
    }
    if (isComplete === true) {
      setFollowsThree(followsTwo)
    }
  }, [followsTwo])
  React.useEffect(() => {
    console.log('followsThree', followsThree)
  }, [followsThree])

  async function getCollections(){
    try {
      const result = await showUser(userId)
      if ((result.data) && (result.data.myFollowing)) {
        const followingsTwo = []
        followingsTwo.length = result.data.myFollowing.length
        const followings = await result.data.myFollowing.map(async (userId, index) => {
          const resUser = await showUser(userId)
          const resultTwo = { _id: resUser.data._id, username: resUser.data.username }
          console.log('resultTwo', resultTwo)
          followingsTwo[index] = resultTwo
          console.log('followingsTwo', followingsTwo)
          
          setFollowsTwo(followingsTwo)
          return (resultTwo)
        })
        console.log('followings', followings)
        setFollows(followings)
      }
    } catch (err) {
      console.log(err)
    }
  }

  function handleFollow(e) {
    history.push(`/users/${e.target.id}`)
  }

  return (
    <>
      {(followsThree.length > 0) &&
        followsThree.map(user => {
          console.log('output 3', followsThree, user)
          return (
            <div key={user._id} onClick={handleFollow} >
              <strong id={user._id} >{user.username}</strong>
            </div>
          )
        })
      }
      {(followsThree.length === 0)  && 
      <strong>Not following anyone</strong>
      }
    </>
  )
}

export default MyFollows