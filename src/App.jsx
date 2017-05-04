import React, {Component} from 'react';
import MessageList from './MessageList.jsx'
import ChatBar from './ChatBar.jsx'
const uuidV4 = require('uuid/v4');



// let IsJsonString = (str) => {
//     try {
//         JSON.parse(str);
//     } catch (e) {
//         return false;
//     }
//     return true;
//   }

// const appData = {
//                   currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
//                   messages: [
//                     {
//                       id: 1,
//                       username: "Bob",
//                       content: "Has anyone seen my marbles?",
//                     },
//                     {
//                       id: 2,
//                       username: "Anonymous",
//                       content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
//                     }
//                   ]
//               }

class App extends Component {


  constructor() {
    super();
    this.state = {
      currentUser: {name: "Bob"},
      messages  : [],
      value: ""

    }

    this.ws = new WebSocket('ws://localhost:3001')
  }




  componentDidMount() {

    this.ws.onmessage = (e) => {
      const messageFromWSS = JSON.parse(e.data)
      const newMessage = {id: messageFromWSS.id, username: messageFromWSS.username, content: messageFromWSS.content }
      const messages = this.state.messages.concat(newMessage)
      this.setState({messages: messages})
    }

  }



  handleInsertUserMessage = (e) => {
    console.log(e.target.className)

    if(e.key == 'Enter'){
      const newMessage = {id: uuidV4(),username: this.state.currentUser.name, content: e.target.value};
      //Send Message to Server
      this.ws.send(JSON.stringify(newMessage));
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      e.target.value = ''
      this.setState({messages: messages})
    }
  }

  handleUserChangeRequest = (e) => {
    if(e.key == 'Enter'){
      let updateUser = e.target.value
      this.setState({currentUser: {name: updateUser}})
    }
  }



  render() {

    return (

      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>

        </nav>
        <MessageList messagesArray={this.state.messages}/>
        <ChatBar currentUser={this.state.currentUser.name} handleInsertUserMessage={this.handleInsertUserMessage} handleUserChangeRequest={this.handleUserChangeRequest} />
      </div>

    );
  }
}
export default App;
