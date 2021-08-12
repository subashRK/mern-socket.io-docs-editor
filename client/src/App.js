import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import { BrowserRouter as Router, Switch } from "react-router-dom"
import { useAuth } from "./context/authContext"
import CircularProgressBar from "./components/CircularProgressBar"
import PrivateRoute from "./components/PrivateRoute"
import Login from "./components/Login"
import Signup from "./components/Signup"
import HomeScreen from "./components/HomeScreen"
import Editor from "./components/Editor"

const App = () => {
  const { loading } = useAuth()

  return (
    <Router>
      {
        loading ? (
          <div className="center" style={{ height: "100vh" }}>
            <CircularProgressBar />
          </div>
        ) : (
          <Switch>
            <PrivateRoute authRequired component={HomeScreen} path="/" exact />
            <PrivateRoute authRequired component={Editor} path="/doc/:id" exact />
            <PrivateRoute component={Login} path="/login" exact />
            <PrivateRoute component={Signup} path="/signup" exact />
          </Switch>
        )
      }
    </Router>
  )
}

export default App
