import ReactDOM from 'react-dom'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import './index.css'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
const localhost = 'b518b1011a20.ngrok.io/'

const client = new W3CWebSocket(`ws://${localhost}`)

const App = () => {

  const [username, setUsername] = React.useState('')
  const [isLoggedIn, setLoggedIn] = React.useState(false)
  const [messages, updateMessages] = React.useState([])

  React.useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected")
    }
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data)
      // console.log('got reply', dataFromServer)
      if(dataFromServer.type === "message"){
        updateMessages([...messages, {
          user: dataFromServer.user,
          msg: dataFromServer.msg
        }])
      }
    }
  }, [messages])

  const onButtonClicked = (e) => {
    e.preventDefault()
    const value = e.target.message.value
    e.target.message.value = ""
    client.send(JSON.stringify({
      type: "message",
      msg: value,
      user: username
    }))
  }

  const login = (e) => {
    e.preventDefault()
    setLoggedIn(true)
  }

  const messageClasses = (user) => {
    let cl = "message"
    cl += user === username ? ' self' : ' other'
    return cl
  }

  return (
    <div id="main">
      {isLoggedIn ?
        <div>
          <ul id="messages-container">
            {messages.map(msg => <li key={uuidv4()} className={messageClasses(msg.user)}>{msg.msg} - {msg.user}</li>)}
          </ul>
          <form id="message-input" onSubmit={onButtonClicked}>
            <input name="message" placeholder="message"/>
            <button>Send</button>
          </form>
        </div>
        :
        <form onSubmit={login}>
          <label>Enter name</label>
          <input name="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <button>Login</button>
        </form>
      }
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
