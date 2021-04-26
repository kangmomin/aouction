const app = require('express')()
const port = 3004
const server = app.listen(port, () => { console.log(`socket is running on 3004`) })
const io = require('socket.io').listen(server)
const fs = require('fs')

const index = require('./')

let room = JSON.parse(fs.readFileSync('F:/문서/node.js/경매/json/room.json').toString())

app.get('/', index)

io.on('connect', (socket) => {
    socket.on('joinRoom', (name) => {
        for(room of room) {
            if(room == name) {
                socket.join(room)
            }
        }
    })

    socket.on('leaveRoom', (name) => {
        socket.leave(name)
    })

    io.on('disconnect', (socket) => {
        socket.emit()
    })
})