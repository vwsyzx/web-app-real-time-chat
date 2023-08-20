const express = require('express');
const http = require('http');
const WebSocket = require('ws')
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const route = require('./route/route');

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({server})



app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use('/api', route)

wss.on('connection', (client) => {
    client.on('message', (ev) => {
        const event = JSON.parse(ev)
        switch(event.status){
            case 'user':
                client.userUnique = event.userUnique
                client.friends = event.friends
                break;
            case 'onEnter':
                client.chatId = event.chatId
                broadcast(event, client.userUnique, event.otherPret.userUnique, event.lastUserPret?.userUnique)
                break;
            case 'off':
                client.send(JSON.stringify({status: 'off', text: 'i am off!!!'}))
                break;
            case 'disconnect':
                disconnect(event, event.userUnique)
                break;
            case 'message':
                msg(event, event.otherPret.userUnique)
                break;
            default:
                break
        }
    })
})
function msg(info, userUnique){
    wss.clients.forEach(client => {
        if(client.userUnique === userUnique){
            client.send(JSON.stringify({status: 'message', chatPret: info.chatPret, otherPret: info.otherPret, otherFriends: info.otherFriends, otherUserOnline: info.otherUserOnline}))
        }
    })
}

function disconnect(info, userUnique){
    wss.clients.forEach(client => {
        if(client.userUnique === userUnique){
            client.send(JSON.stringify(info))
        }
    })
}
function broadcast(event, current, userUnique, lastUser){
    wss.clients.forEach(client => {
        if(client.userUnique === userUnique){
            client.send(JSON.stringify({userPret: event.otherPret, friends: event.otherFriends, status: 'enter'}))
        }
        else if(client.userUnique === lastUser){
            client.send(JSON.stringify({userPret: event.lastUserPret, friends: event.lastFriends, status: 'back'}))
        }
        else if(client.userUnique === current)[
            client.send(JSON.stringify({userPret: event.userPret, friends: event.friends, status: 'back'}))
        ]
    })
}

async function start(){
    try {
        await mongoose.connect('mongodb+srv://islom:islom2006@cluster0.x41i2c2.mongodb.net/?retryWrites=true&w=majority')
        server.listen(3500, () => console.log("Server started on POST: 3500"))
    } catch (error) {
        console.log(error)
    }
}
start()