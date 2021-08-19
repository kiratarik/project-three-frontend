function Register() {

  return (
    <section className="section">
      <div className="center-container">
        <div>
          <h2>Welcome to pictureREST</h2>
          <p>Sign up to collect, share and find great photo spots</p>
        </div>
        <div className="form-container">
          <form>
            <div className="field">
              <label className="label">Username</label>
              <div>
                <input
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
                  type="password"
                  className="input"
                  placeholder="Password"
                  name="password"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Password Confirmation</label>
              <div className="control">
                <input
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
              >Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )

}

export default Register