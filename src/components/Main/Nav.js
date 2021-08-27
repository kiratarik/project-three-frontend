import React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { getPayload, getToken, isAuthenticated, removeToken } from '../../functionLib/auth'
import { showUser } from '../../functionLib/api'


function Nav() {
  const [userData, setUserData] = React.useState()
  const [userId, setUserId] = React.useState()
  const [tokenAdministered, setTokenValid] = React.useState(false)
  const [reload, setReload] = React.useState(false)
  const history = useHistory()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = React.useState(null)

  React.useEffect(() => {
    const token = getToken()
    setTokenValid(token)

    setIsLoggedIn(isAuthenticated())
  }, [location])


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
    }

  },[tokenAdministered])

  function handleLogOut() {
    removeToken()
    history.push('/')
    setIsLoggedIn(false)
    if (reload === false) {
      setReload(true)
    } else {
      setReload(false)
    }
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
            <Link to={`/users/${userId}/pictures`}>
              {userData && `${userData.username}`}
            </Link>
            <Link to="/images/new">
              <button>
              Upload a photo
              </button>
            </Link>
            <a
              onClick={handleLogOut}
            >Log Out</a>
          </>
        ) }
        
      </div>

    </nav>
  )
}

export default Nav