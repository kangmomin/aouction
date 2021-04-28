const app = require('express')()
const port = 3004
const server = app.listen(port, () => { console.log(`socket is running on 3004`) })
const io = require('socket.io').listen(server)
const fs = require('fs')

const index = require('./')

app.set('views', __dirname + '/public')
app.set('view engine','ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

io.on('connect', (socket) => {
    let room = JSON.parse(fs.readFileSync('F:/문서/node.js/경매/json/room.json').toString())
    
    socket.on('joinRoom', (name) => {
        for(_room in room.main) {
            console.log(room.main[_room])
            if(room.main[_room] == name) {
                return socket.join(_room)
            }
        }
        fs.writeFileSync('F:/문서/node.js/경매/json/room.json', JSON.stringify(room))
    })

    socket.on('leaveRoom', (name) => {
        socket.leave(name)
    })

    io.on('disconnect', (socket) => {
        socket.emit()
    })
})