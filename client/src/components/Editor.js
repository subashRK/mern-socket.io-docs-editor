import { useEffect, useRef, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import "../Editor.css"
import { useParams, useHistory } from "react-router-dom"
import { io } from "socket.io-client"
import { SERVER_DOMAIN } from "../utils"

const TOOLBAR_OPTIONS = [
  [
    { size: ['small', false, 'large', 'huge'] },
    { header: [false, 1, 2, 3, 4, 5, 6] },
    { font: [] }
  ],
  [
    { background: [] }, 
    { color: [] },
    "bold",
    "italic",
    "strike",
    "underline",
    "link",
    'blockquote', 
    'code-block',
    "clean"
  ],
  [
    { 'list': 'ordered'}, 
    { 'list': 'bullet' },
    { 'script': 'sub'}, 
    { 'script': 'super' },
    { 'indent': '-1'}, 
    { 'indent': '+1' },
    { 'direction': 'rtl' },   
    { align: [] }
  ],
]

const Editor = () => {
  const { id } = useParams()
  const history = useHistory()
  const [socket, setSocket] = useState(null)
  const [editor, setEditor] = useState(null)
  const editorParentRef = useRef()

  useEffect(() => {
    if (editorParentRef) editorParentRef.current.innerHTML = "<div id='editor' class='center' />"
    
    const quill = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS
      }
    })

    setEditor(quill)
  }, [editorParentRef])

  useEffect(() => {
    const socketIo = io(SERVER_DOMAIN || "http://localhost:5000", { withCredentials: true, query: { id } })

    socketIo.on("connect_error", e => {
      alert(e.message)
      history.push("/")
    })
    socketIo.on("connect", () => setSocket(socketIo))

    return () => socketIo.disconnect()
  }, [history, id])

  useEffect(() => {
    if (!socket || !editor) return

    let interval

    socket.on("error", e => alert(e))

    socket.on("doc-content", content => {
      editor.setContents(content)
    })

    socket.on("send-latest-content", () => {
      interval = setInterval(() => {
        socket.emit("latest-content", editor.getContents())
      }, 2000)
    })

    editor.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("update-content", delta)
    })

    socket.on("update-content", delta => {
      editor.updateContents(delta)
    })

    return () => interval && clearInterval(interval)
  }, [editor, socket])

  return <div ref={editorParentRef}></div>
}

export default Editor
