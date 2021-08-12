import { createContext, useContext, useEffect, useState } from "react"
import { getError, axios } from "../utils"

const AuthContext = createContext()

const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    axios.get("/user")
      .then(res => setCurrentUser(res.data))
      .catch(e => console.log(e.message))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    let error = null

    const res = await axios.post("/login", { email, password })
      .catch(e => {
        error = getError(e)
        console.log(e.message)
      })

    if (res?.data.user) setCurrentUser(res?.data.user)    
    return error
  }

  const signup = async (email, password) => {
    let error = null

    const res = await axios.post("/signup", { email, password })
      .catch(e => {
        error = getError(e)
        console.log(e.message)
      })

    if (res?.data.user) setCurrentUser(res?.data.user)    
    return error
  }

  const logout = async () => {
    const res = await axios.get("/logout")
      .catch(e => {
        console.log(e.message)
      })

    if (res?.data) setCurrentUser(null)
  }

  const value = {
    loading,
    currentUser,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, useAuth }
