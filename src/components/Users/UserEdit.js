import React from 'react'
import { useParams } from 'react-router-dom'
import { showUser } from '../../functionLib/api'
import { editUser } from '../../functionLib/api'

const initialState = {
  username: '',
  password: '',
}


function UserEdit() {
  const { userId } = useParams()
  const [userData, setUserData] = React.useState(initialState)
  const [errors, setErrors] = React.useState(initialState)

  React.useEffect(() => {

    async function getData(){
      try {
        const response = await showUser(userId)
        setUserData(response.data)
      } catch (err) {
        console.log(err)
      }
    }

    getData()

  }, [userId])

  console.log(errors)



  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await editUser(userData)
    } catch (err) {
      err.response.data.username = 'Oops! Username required'
      err.response.data.email = 'Oops! Email required'
      setErrors(err.response.data)
    }
  }

  console.log('errors', errors)

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  return (
    <section className="section">
      <div className="center-container">
        <div>
          <h3 className="text-is-centered">Edit your profile info</h3>
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <div>
                {errors.username && 
                (<p className="error-text">{errors.username}</p>)}
                <input
                  onChange={handleChange}
                  className="input"
                  placeholder="Username"
                  name="username"
                  value={userData.username}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div>
                {errors.email && 
                (<p className="error-text">{errors.email}</p>)}
                <input
                  onChange={handleChange}
                  className="input"
                  placeholder="Email Address"
                  name="email"
                  value={userData.email}
                />
              </div>
            </div>
            <div className="field">
              <button type="submit" 
                className="button-outline"
              >Confirm changes</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default UserEdit