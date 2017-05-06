import React, {Component} from 'react'
import MessageList from './MessageList.jsx'
import ChatBar from './ChatBar.jsx'
const uuidV4 = require('uuid/v4')

class App extends Component {
  constructor() {
    super()
    this.state = {
      currentUser: {name: "Anonymous"},
      messages  : [],
      clientCount: 0
    }
  }
  componentDidMount() {
    this.ws = new WebSocket('ws://localhost:3001')
    this.ws.onopen = (event) => {
      console.log("Connected to server")
    }

    this.ws.onmessage = (e) => {
      const messageFromWSS = JSON.parse(e.data)

      if(messageFromWSS.type !== "incomingNotification"){
        const newMessage = {id: messageFromWSS.id, username: messageFromWSS.username, content: messageFromWSS.content, type: messageFromWSS.type, color: messageFromWSS.color }
        const messages = this.state.messages.concat(newMessage)
        this.setState({messages: messages})
      } else {
        const newNotification = {id: messageFromWSS.id, username: messageFromWSS.username, content: messageFromWSS.content, type: messageFromWSS.type}
        const notifPlusmessages = this.state.messages.concat(newNotification)
          if((messageFromWSS.username !=="ServerOnConnect")&&(messageFromWSS.username !=="ServerOnDisconnect")){
            this.setState({messages: notifPlusmessages})
          } else {
            this.setState({messages: notifPlusmessages,
                          clientCount: Number(messageFromWSS.content)})
          }
      }
    }
  }

  handleInsertUserMessage = (e) => {
    if(e.key == 'Enter'){
      const newMessage = {username: this.state.currentUser.name, content: e.target.value, type: "postMessage"}
      //Send Message to Server
      this.ws.send(JSON.stringify(newMessage))
      const messages = this.state.messages.concat(newMessage)
      e.target.value = ''
    }
  }

  handleUserChangeRequest = (e) => {
    if(e.key == 'Enter'){
      let updateUser = e.target.value
      let currentUser = this.state.currentUser.name
      const newNotificiationMessage = {id: uuidV4(),username: currentUser, content: `User:${currentUser} has changed their name to User:${updateUser}`, type: "postNotification"}
      //Send Message to Server
      this.ws.send(JSON.stringify(newNotificiationMessage))
      const messages = this.state.messages.concat(newNotificiationMessage)
      this.setState({currentUser: {name: updateUser}, messages: messages})
    }
  }
  render() {

    return (

      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <div className="userCount">{this.state.clientCount} users online</div>
        </nav>
        <MessageList messagesArray={this.state.messages}/>
        <ChatBar currentUser={this.state.currentUser.name} handleInsertUserMessage={this.handleInsertUserMessage} handleUserChangeRequest={this.handleUserChangeRequest} />
      </div>

    )
  }
}

export default App
