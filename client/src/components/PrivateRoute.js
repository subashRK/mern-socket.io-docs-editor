import { Redirect, Route } from "react-router-dom" 
import { useAuth } from "../context/authContext"

const PrivateRoute = ({ component, authRequired, ...opt }) => {
  const { currentUser } = useAuth()

  if (authRequired) return currentUser ? <Route component={component} {...opt} /> : <Redirect to="/login" />
  return !currentUser ? <Route component={component} {...opt} /> : <Redirect to="/" />
}

export default PrivateRoute
