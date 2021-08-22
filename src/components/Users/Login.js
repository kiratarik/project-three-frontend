import React from 'react'

function Login() {

  const [formData, setFormData] = React.useState({

    username: '',
    email: '',
    password: '',

  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  console.log(formData)

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      alert(`Submitting ${JSON.stringify(formData, null, 2)}`) 
    } catch (error) {
      console.log(error)
    }
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
              <label className="label">Username</label>
              <div>
                <input
                  onChange={handleChange}
                  className="input"
                  placeholder="Username"
                  name="userName"
                  
                />
              </div>
            </div>
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