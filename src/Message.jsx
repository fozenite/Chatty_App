import React, {Component} from 'react';


class Message extends Component {

  messageTypeSpecificOutputM = () => {
    let a = <div></div>
    if ((this.props.type === "incomingMessage")||(this.props.type === "postMessage"))
    {
        a =<div>
            <span className="message-username">{this.props.username}</span>
            <span className="message-content">{this.props.content}</span>
           </div>
    }


        return (
          a
        );
  }

  messageTypeSpecificOutputN = () => {
    let b = <div></div>

    if(this.props.username === "ServerOnConnect") {
      b= <div>
          A new user has entered the channel
        </div>
    } else if (this.props.username === "ServerOnDisconnect"){
      b= <div>
          A user has left the channel
        </div>
    } else if ((this.props.type !== "incomingMessage")&&(this.props.type !== "postMessage")) {
        b =<div>
            {this.props.content}
           </div>
    }


    return (b);
  }

 render() {
  let output = this.messageTypeSpecificOutputM()
  let output2 = this.messageTypeSpecificOutputN()
   return (
    <div>
     <div className="message">
       {output}
     </div>
     <div className="message system">
        {output2}
     </div>
    </div>
   );
 };
}

export default Message;

