
// const express = require('express');
const SocketServer = require('ws').Server;
const uuidV4 = require('uuid/v4');
const randomColor = require('randomcolor')
// Set the port to 3001
const PORT = 3001;

// Create a new express server
// const server = express()
//    // Make the express server serve static assets (html, javascript, css) from the /public folder
//   .use(express.static('public'))
//   .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ port: PORT });




// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
console.log(`Listening on ${PORT}`);
wss.on('connection', (ws) => {
const setColor = randomColor({luminosity: 'dark'})

  const broadcast = (message) => {
    wss.clients.forEach((c) => {
      if(c != ws) {
        c.send(JSON.stringify(message))
      }
    });
  }


  const broadcastAll = (message) => {
    wss.clients.forEach((c) => {
        c.send(JSON.stringify(message))
    });
  }

  const clientCounter = () => {
    let clientCount = 0
    wss.clients.forEach((c) => {
      clientCount++
    })
    return clientCount
  }

  const onConnectMessage = {id: uuidV4(), username: "ServerOnConnect", content: clientCounter(), type: "incomingNotification" }
  broadcastAll(onConnectMessage)






  console.log('Client connected');

  // ws.send('Connected to server');

  ws.on('message', (rawMessage) => {
    const messageFromClient = JSON.parse(rawMessage);
    if(messageFromClient.type !== "postNotification" ){
      const outGoingMessage = {id: uuidV4(), username: messageFromClient.username, content: messageFromClient.content, type: "incomingMessage", color: setColor }
      broadcastAll(outGoingMessage)
    } else {
      const outGoingNotification ={id: messageFromClient.id, username: messageFromClient.username, content: messageFromClient.content, type: "incomingNotification" }
      broadcast(outGoingNotification)
    }

  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
    const onDisconnectMessage = {id: uuidV4(), username: "ServerOnDisconnect", content: clientCounter(), type: "incomingNotification" }
    broadcastAll(onDisconnectMessage)

  });
});


