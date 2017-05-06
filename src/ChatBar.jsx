import React, {Component} from 'react'

class ChatBar extends Component {


 constructor(props) {
    super(props)
    this.state = {value: this.props.currentUser}

    this.handleChange = this.handleChange.bind(this)

  }
  handleChange(event) {
    this.setState({value: event.target.value})
  }
  // console.log(this.props.currentUser)
  render() {
    return (
      <div>
        <footer className="chatbar">

            <input className="chatbar-username" value={this.state.value} onChange={this.handleChange} onKeyPress ={this.props.handleUserChangeRequest} />
            <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress ={this.props.handleInsertUserMessage} />
       </footer>
      </div>
    )
  }
}
export default ChatBar


