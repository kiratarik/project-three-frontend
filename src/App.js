import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Nav from './components/Main/Nav.js'
import SecureRoute from './components/Main/SecureRoute.js'
import Home from './components/Main/Home.js'
import ImageSubmit from './components/Images/ImageSubmit.js'
import ImageEdit from './components/Images/ImageEdit.js'
import ImageShow from './components/Images/ImageShow.js'
import UserEdit from './components/Users/UserEdit.js'
import UserShow from './components/Users/UserShow.js'
import Register from './components/Users/Register.js'
import Login from './components/Users/Login.js'
import UserNav from './components/Users/UserNav.js'
import MyCollections from './components/Users/MyCollections.js'
import MyPictures from './components/Users/MyPictures.js'
import MyFollows from './components/Users/MyFollows.js'
import { getPayload, isAuthenticated, isOwner } from './functionLib/auth.js'

function App() {
  const  userId = getPayload().sub
  const [isAuth, setIsAuth] = React.useState(false)

  console.log(userId)

  React.useState(() => {
    if  (isAuthenticated() && isOwner(userId)){
      setIsAuth(true)
    } else {
      setIsAuth(false)
    }
  },[])



  console.log(isAuth)

  return (
    <BrowserRouter>
      <Nav auth={isAuth}/>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <SecureRoute path='/images/new'>
          <ImageSubmit />
        </SecureRoute>
        <SecureRoute path='/images/:imageId/edit'>
          <ImageEdit />
        </SecureRoute>
        <Route path='/images/:imageId'>
          <ImageShow />
        </Route>
        <SecureRoute path='/users/:userId/edit'>
          <UserEdit />
        </SecureRoute>
        <Route path='/users/:userId'>
          <UserShow />
          <UserNav />
          <Switch>
            <Route path='/users/:userId/collections'>
              <MyCollections />
            </Route>
            <Route path='/users/:userId/pictures'>
              <MyPictures />
            </Route>
            <Route path='/users/:userId/follows'>
              <MyFollows />
            </Route>
          </Switch>
        </Route>
        <Route path='/register'>
          <Register />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
