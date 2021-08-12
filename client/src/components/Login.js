import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authContext"
import Error from "./Error"

const Login = () => {
  const [error, setError] = useState(null)
  const { login } = useAuth()

  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = async e => {
    e.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value

    e.target.disabled = true
    const failedError = await login(email, password)
    if (failedError) setError(failedError)
    e.target.disabled = false
  }

  return (
    <div style={{ height: "100vh"}} className="center">
      <form style={{ minWidth: 350, maxWidth: "70%" }} onSubmit={handleSubmit} className="shadow p-3">
        <div className="mb-3">
          <h1 className="fs-2" style={{ fontWeight: "normal" }}>Login</h1>
          <hr />
        </div>
        {error && <Error error={error} />}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" ref={emailRef
          } name="email" className="form-control" placeholder="name@example.com" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input name="password" ref={passwordRef} type="password" className="form-control" placeholder="your password" required />
        </div>
        <hr />
        <div>
          <button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Login</button>
          <Link to="/signup" className="btn btn-outline-dark mt-1" style={{ width: "100%" }}>
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Login
