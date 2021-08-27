import React from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { showUser } from '../../functionLib/api.js'

function MyFollows() {
  const { userId } = useParams()
  const [follows, setFollows] = React.useState([])
  const [followsTwo, setFollowsTwo] = React.useState([])
  const [followsThree, setFollowsThree] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const history = useHistory()

  React.useEffect(() => { 
    getData()
  }, [userId])

  const getData = async () => {
    setIsLoading(true)
    try {
      const result = await showUser(userId)
      if ((result.data) && (result.data.myFollowing)) {
        const followings = []
        await result.data.myFollowing.map(async (userId, index) => {
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
    setIsLoading(false)
  }

  React.useEffect(() => {
    console.log('follows', follows)
    const getUser = async () => {
      try {
        setIsLoading(true)
        const thisUser = await showUser(userId)
        if ((thisUser.data) && (thisUser.data.myFollowing) && thisUser.data.myFollowing.length !== follows.length) {
          getData()
        } else if (followsTwo.length === 0) {
          console.log('complete', follows, thisUser.data)
          setFollowsTwo(follows)
        }
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    }
    getUser()
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
      {(followsTwo.length > 0) && (!isLoading) &&
        followsTwo.map(user => {
          console.log('output 2', followsTwo, user)
          return (
            <div key={user._id} onClick={handleFollow} >
              <p id={user._id} >{user.username}</p>
            </div>
          )
        })
      }
      {(followsTwo.length === 0) && (!isLoading) &&
      <p>Not following anyone</p>
      }
      {(isLoading) && 
      <p>...Loading</p>
      }
    </>
  )
}

export default MyFollows