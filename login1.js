import { useState } from "react"


const Login = () => {

  const [data, setData] = useState({
    id: "",
    email: "",
    password: "",
  })

  const handleEmail = (e) => setData({ email: e.target.value });
  const handlePassword = (e) => setData({ password: e.target.value });



  const handleSubmit = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
    };
    fetch('http://localhost:8000/users', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setData({ id: data.id })
      });
  }

  return (
    <div className="modal fade" id="login" tabIndex="-1" aria-labelledby="login" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered  modal-sd">
        <div className="modal-content">
          <div className="container p-5">
            <div className="row text-center">
              <p className="login-title">LOGIN</p>
              <p className="text-start create">Not Register? <span className="forgot-password" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#register">Create an Account</span></p>
            </div>
            <div className="row">
              <div className="input registerForm">
                <input type="email" className="form-control bg-input" placeholder="Email.." onChange={handleEmail} value={data.email} />
              </div>
            </div>
            <div className="row">
              <div className="input registerForm">
                <input type="password" className="form-control bg-input" placeholder="Password" onChange={handlePassword} value={data.password} />
              </div>
            </div>
            <div className="row login">
              <button type="submit" className="btn deg_btn" data-bs-dismiss="modal" onSubmit={handleSubmit}>Submit</button>
              <p className="text-center text-muted my-3">Forgot Password? <span className="forgot-password">Click Here</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;