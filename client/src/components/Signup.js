import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authContext"
import Error from "./Error"

const Signup = () => {
  const { signup } = useAuth()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmationRef = useRef()
  const [error, setError] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value
    const passwordConfirmation = passwordConfirmationRef.current.value

    if (password !== passwordConfirmation) return setError("Two passwords didn't match!")

    e.target.disabled = true
    const failedError = await signup(email, password)
    if (failedError) setError(failedError)
    e.target.disabled = false
  }

  return (
    <div style={{ height: "100vh"}} className="center">
      <form style={{ minWidth: 350, maxWidth: "70%" }} onSubmit={handleSubmit} className="shadow p-3">
        <div className="mb-3">
          <h1 className="fs-2" style={{ fontWeight: "normal" }}>Sign up</h1>
          <hr />
        </div>
        {error && <Error error={error} />}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" name="email" className="form-control" placeholder="name@example.com" required ref={emailRef} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input name="password" type="password" className="form-control" placeholder="your password" required ref={passwordRef} />
        </div>
        <div className="mb-3">
          <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
          <input name="confirm-password" type="password" className="form-control" placeholder="confirm your password" required ref={passwordConfirmationRef} />
        </div>
        <hr />
        <div>
          <button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Sign up</button>
          <Link to="/login" className="btn btn-outline-dark mt-1" style={{ width: "100%" }}>
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Signup
