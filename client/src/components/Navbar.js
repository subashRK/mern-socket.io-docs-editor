import { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { getError, axios } from "../utils"
import Error from "./Error"

const Navbar = () => {
  const { logout } = useAuth()
  const history = useHistory()
  const [error, setError] = useState(null)

  const handleLogout = async e => {
    e.target.disabled = true
    await logout()
    e.target.disabled = false
  }

  const handleAddDoc = async e => {
    e.target.disabled = true
    setError(null)

    const res = await axios.post("/doc/new")
      .catch(error => {
        setError(getError(error))
        e.target.disabled = false
      })

    if (res?.data) history.push(`/doc/${res.data.doc.id}`)
  }

  return (
    <>
      <nav className="sticky-top navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link as="h1" className="navbar-brand" to="/"><h1 className="fs-5 normal-text">Docs Editor</h1></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button className="nav-link" onClick={handleAddDoc} aria-current="page">New Doc</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout} tabIndex="-1">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {error && (
        <div className="m-3">
          <Error error={error} />
        </div>
      )}
    </>
  )
}

export default Navbar
