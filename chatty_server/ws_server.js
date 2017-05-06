
const SocketServer = require('ws').Server
const uuidV4 = require('uuid/v4')
const randomColor = require('randomcolor')
const querystring = require('querystring')
const fetch = require('node-fetch')

// Set the port to 3001
const PORT = 3001
// Create a new express server
// const server = express()
//    // Make the express server serve static assets (html, javascript, css) from the /public folder
//   .use(express.static('public'))
//   .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ port: PORT })
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
console.log(`Listening on ${PORT}`)
wss.on('connection', (ws) => {
  const setColor = randomColor({luminosity: 'bright'})

  const filterForGiphy = (messageFromClient) => {
    let to_send

    if(matches = messageFromClient.content.match(/^\/giphy (.+)$/)) {
      let qs = querystring.stringify({
      api_key: 'dc6zaTOxFJmzC',
      tag: matches[1]
      })
      fetch(`https://api.giphy.com/v1/gifs/random?${qs}`)
      .then( resp => {return resp.json() } )
      .then( json => {
        to_send = `<img src="${json.data.image_url}" alt=""/>`
        const outGoingMessage1 = {id: uuidV4(), username: messageFromClient.username, content: to_send, type: "incomingMessage", color: setColor }
        broadcastAll(outGoingMessage1)
      })
    } else {
      to_send = messageFromClient.content
      const outGoingMessage = {id: uuidV4(), username: messageFromClient.username, content: to_send, type: "incomingMessage", color: setColor }
      broadcastAll(outGoingMessage)
    }

  }

  const broadcast = (message) => {
    wss.clients.forEach((c) => {
      if(c != ws) {
        c.send(JSON.stringify(message))
      }
    })
  }

  const broadcastAll = (message) => {
    wss.clients.forEach((c) => {
        c.send(JSON.stringify(message))
    })
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
  console.log('Client connected')

  ws.on('message', (rawMessage) => {
    const messageFromClient = JSON.parse(rawMessage)
    if(messageFromClient.type !== "postNotification" ){
      filterForGiphy(messageFromClient)

    } else {
      const outGoingNotification ={id: messageFromClient.id, username: messageFromClient.username, content: messageFromClient.content, type: "incomingNotification" }
      broadcast(outGoingNotification)
    }

  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
    const onDisconnectMessage = {id: uuidV4(), username: "ServerOnDisconnect", content: clientCounter(), type: "incomingNotification" }
    broadcastAll(onDisconnectMessage)
  })
})


