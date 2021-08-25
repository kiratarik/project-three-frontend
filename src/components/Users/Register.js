import React from 'react'
import { createUser } from '../../functionLib/api'

const initialState = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
}

function Register() {
  const [formData, setFormData] = React.useState(initialState)
  const [formErrors, setFormErrors] = React.useState(initialState)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createUser(formData)
    } catch (err) {
      err.response.data.username = 'Oops! Username required'
      err.response.data.email = 'Oops! Email required'
      err.response.data.password = 'Oops! Password required'
      err.response.data.passwordConfirmation = 'Oops! Passwords must match'
      setFormErrors(err.response.data)
    }
  }

  

  return (
    <section className="section">
      <div className="center-container">
        <div>
          <h2 className="text-is-centered">Welcome to pictureREST</h2>
          <p className="text-is-centered">Sign up to collect, share and find great photo spots</p>
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <div>
                {formErrors.username && (<p className="error-text 
                text-is-centered">{formErrors.username}</p>)}
                <input
                  onChange={handleChange}
                  className="input"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div>
                {formErrors.email && (<p className="error-text 
                text-is-centered">{formErrors.email}</p>)}
                <input
                  onChange={handleChange}
                  className="input"
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                {formErrors.password && (<p className="error-text 
                text-is-centered">{formErrors.password}</p>)}
                <input
                  onChange={handleChange}
                  type="password"
                  className="input"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Password Confirmation</label>
              <div className="control">
                {formErrors.passwordConfirmation && (<p className="error-text 
                text-is-centered">{formErrors.passwordConfirmation}</p>)}
                <input
                  onChange={handleChange}
                  type="password"
                  className="input"
                  placeholder="Confirm your password"
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                />
              </div>
            </div>
            <div className="field">
              <button type="submit" 
                className="button-outline"
              >Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )

}

export default Register