import React from 'react'
import { logInUser } from '../../functionLib/api.js'
import { setToken } from '../../functionLib/auth.js'
import { useHistory } from 'react-router'

function Login() {
  const history = useHistory()
  const [formData, setFormData] = React.useState({

    email: '',
    password: '',

  })


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  console.log(formData)

  const handleSubmit = (e) => {
    e.preventDefault()
    async function submit(){
      try {
        const result = await logInUser(formData)
        console.log(result.data)
        setToken(result.data.token)
        history.push('/')
      } catch (error) {
        console.log(error)
      }
    }
    submit()
  }



  return (
    <section className="section">
      <div className="center-container">
        <div>
          <h2 className="text-is-centered">Welcome back</h2>
          <p className="text-is-centered">Sign in below</p>
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Email</label>
              <div>
                <input
                  onChange={handleChange}
                  className="input"
                  placeholder="Email Address"
                  name="email"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input
                  onChange={handleChange}
                  type="password"
                  className="input"
                  placeholder="Password"
                  name="password"
                />
              </div>
            </div>
            <div className="field">
              <button type="submit" 
                className="button-outline"
              >Log in</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  ) 
}

export default Login