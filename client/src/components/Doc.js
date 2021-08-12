import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { axios, getError } from "../utils"

const Doc = ({ name, id, setError, owner, changeDoc }) => {
  const inputRef = useRef()
  const [disabled, setDisabled] = useState(false)
  const { currentUser } = useAuth()

  const fetchDoc = async (url, obj) => {
    setDisabled(true)

    const res = await axios.put("/doc" + url, obj)
    .catch(e => setError(getError(e)))

    if (!res?.data) {
      inputRef.current.value = ""
      setDisabled(false)
      return
    }

    setError(null)
    changeDoc(res.data.doc)
    inputRef.current.value = ""
    setDisabled(false)
  }

  const renameDoc = () => {
    if (!inputRef.current.value.trim() || inputRef.current.value === name) return
    fetchDoc("/rename", { id, name: inputRef.current.value })
  }

  const addUser = () => {
    if (!inputRef.current.value.trim() || inputRef.current.value === currentUser.email) return
    fetchDoc("/add-user", { id, email: inputRef.current.value })
  }

  return (
    <div className="card p-3 m-2" style={{ maxWidth: "70%", width: 350 }}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center">
          <h2 className="fs-6 normal-text">Name: {name ? name : "Untitled document"}</h2>
          {
            owner === currentUser.email && (
              <span className="badge bg-primary rounded-pill ms-2 p-1" title="You are the owner">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
              </span>
            ) 
          }
        </div>
        <Link to={`/doc/${id}`} className="text-muted" title="View this doc">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
          </svg>
        </Link>
      </div>

      <hr/>
      <form className="form-group" onSubmit={e => e.preventDefault()}>
        <input required className="form-control" placeholder="Name / Email" ref={inputRef} />
        <div className="d-flex flex-wrap pt-2">
          <button className="btn btn-primary btn-sm me-1" style={{ flex: 0.5, fontSize: 16 }} onClick={renameDoc} disabled={disabled}>Rename</button>
          <button className="btn btn-secondary ms-1 btn-sm" style={{ flex: 0.5, fontSize: 16 }} onClick={addUser} disabled={disabled}>Add User</button>
        </div>
      </form>
    </div>
  )
}

export default Doc
