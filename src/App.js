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



function App() {
  const [arrayImages, setArrayImages] = React.useState([])

  return (
    <BrowserRouter>
      <Nav />
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <SecureRoute path='/images/new'>
          <ImageSubmit arrayImages={arrayImages} setArrayImages={setArrayImages}  />
        </SecureRoute>
        <SecureRoute path='/images/:imageId/edit'>
          <ImageEdit arrayImages={arrayImages} setArrayImages={setArrayImages} />
        </SecureRoute>
        <Route path='/images/:imageId'>
          <ImageShow arrayImages={arrayImages} />
        </Route>
        <SecureRoute path='/users/:userId/edit'>
          <UserEdit />
        </SecureRoute>
        <Route path='/users/:userId'>
          <UserShow />
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
