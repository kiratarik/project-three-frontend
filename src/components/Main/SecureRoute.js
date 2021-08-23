// import React from 'react'
// import { Route, Redirect } from 'react-router-dom'
// import { removeToken, isAuthenticated } from '../../lib/auth'
// function SecureRoute({ component: Component, ...rest }) {
//   if (isAuthenticated()) return <Route {...rest} component={Component} />
//   removeToken()
//   return <Redirect to='/login' />
// }
// export default SecureRoute
import { isAuthenticated, removeToken } from '../../functionLib/auth'
import React from 'react'
import { Redirect, Route } from 'react-router-dom'

function SecureRoute({ component: Component, ...rest }) {
  if (isAuthenticated){
    return (<Route {...rest} component={Component} />)
  }
  removeToken()
  return <Redirect to="/login" />
}

export default SecureRoute