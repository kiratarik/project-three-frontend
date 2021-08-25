import React from 'react'
import { Link } from 'react-router-dom'
import { getPayload, getToken, isAuthenticated, removeToken } from '../../functionLib/auth'
import { showUser } from '../../functionLib/api'


function Nav(props) {
  const [userData, setUserData] = React.useState()
  const [userId, setUserId] = React.useState()
  const [tokenAdministered, setTokenValid] = React.useState(false)


  console.log(props.auth)
  // React.useEffect(() => {
  //   if (props.auth === true) {
  //     setIsAuth(true)
  //   } else {
  //     setIsAuth(false)
  //   }
  // },[])
  const isLoggedIn = isAuthenticated()

  console.log(isLoggedIn)

  React.useEffect( () => {

    const token = getToken()
    if (!token) return console.log('you are not logged in')
    setTokenValid(token)
  }, [])


  React.useEffect( () => {

    const payload = getPayload() 
    const userId = payload.sub
    setUserId(userId)
   
    async function getUserData(){
      try {
        const user = await showUser(userId)
        if (!user) throw new Error()
        setUserData(user.data)
      } catch (err){
        console.log(err)
      }
    }

    if (userId){
      getUserData()
    } console.log('you are not logged in')

  },[tokenAdministered])

  function handleLogOut() {
    removeToken()
    window.location.reload()
  }

  return (
    <nav className="top-nav">
      <div className="logo">
        <Link to="/">
          <h3>PictureREST</h3>
        </Link>
      </div>

      <div className="nav-links">
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              Login
            </Link>
            <Link to="/register">
              Sign up
            </Link>
          </>
        ) : (
          <>
            <Link to={`/users/${userId}`}>
              {userData && `${userData.username}`}
            </Link>
            <Link to="/images/new" className="red-button-small">
              Upload a photo
            </Link>
            <button
              className="button-outline"
              onClick={handleLogOut}
            >Log Out</button>
          </>
        ) }
        
      </div>

    </nav>
  )
}

export default Nav