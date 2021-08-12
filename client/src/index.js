import React from "react"
import ReactDom from "react-dom"
import App from "./App"
import { AuthProvider } from "./context/authContext"

ReactDom.render(
  <AuthProvider>
    <App />
  </AuthProvider>, 
  document.getElementById("root")
)
