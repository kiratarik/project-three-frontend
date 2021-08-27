import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Nav from './components/main/Nav.js'
import SecureRoute from './components/main/SecureRoute.js'
import Home from './components/main/Home.js'
import ImageSubmit from './components/images/ImageSubmit.js'
import ImageEdit from './components/images/ImageEdit.js'
import ImageShow from './components/images/ImageShow.js'
import UserEdit from './components/users/UserEdit.js'
import UserShow from './components/users/UserShow.js'
import Register from './components/users/Register.js'
import Login from './components/users/Login.js'
import UserNav from './components/users/UserNav.js'
import MyCollections from './components/users/MyCollections.js'
import MyPictures from './components/users/MyPictures.js'
import MyFollows from './components/users/MyFollows.js'

function App() {

  return (
    <BrowserRouter>
      <Nav />
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
