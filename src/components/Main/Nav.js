import React from 'react'
import { Link } from 'react-router-dom'

function Nav() {

  return (
    <nav className="top-nav">
      <div className="logo">
        <Link to="/">
          <h3>PictureREST</h3>
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/login">
          Login
        </Link>
        <Link to="/register">
          Sign up
        </Link>
        <Link to="/images/new" className="red-button-small">
          Upload a photo
        </Link>
      </div>

    </nav>
  )
}

export default Nav