import { useEffect, useState } from "react"
import { axios, getError } from "../utils"
import CircularProgressBar from "./CircularProgressBar"
import Doc from "./Doc"
import Error from "./Error"

const DocList = () => {
  const [docs, setDocs] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDocs = async () => {
      const res = await axios.get("/docs")
      .catch(e => setError(getError(e)))

      if (res?.data) return setDocs(res.data)
      setDocs([])
    }

    fetchDocs()
  }, [])

  const changeDoc = (id, doc) => setDocs(oldDocs => oldDocs.map(currentDoc => {
    if (currentDoc.id === id) {
      for (let key in doc) {
        currentDoc[key] = doc[key]
      }
    }
    
    return currentDoc
  }))

  return (
    <div className="container">
      {error && (
        <div className="m-3">
          <Error error={error} />
        </div>
      )}

      <div className="row align-self-start justify-content-center my-4">
        {
          !docs ? (
            <div className="center" style={{ height: "50vh" }}>
              <CircularProgressBar />
            </div>
          ) : docs.length === 0 ? (
              <div className="center" style={{ height: "50vh" }}>
                <p className="text-center fs-3">No document found!</p>
              </div>
            ) : docs.map(({ id, owner, name }) => (
              <Doc
                key={id}
                id={id}
                owner={owner}
                name={name}
                setError={setError}
                changeDoc={doc => changeDoc(id, doc)}
              />
            ))
        }
      </div>
    </div>
  )
}

export default DocList
