const app = require('express')()
const port = 3004
const server = app.listen(port, () => { console.log(`socket is running on 3004`) })
const io = require('socket.io').listen(server)
const bp = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const fs = require('fs')
//쿠키로 서버 명을 저장, 세션으로 로그인 유무 확인.

const index = require('./')

//-----------------------

app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
}))

app.post('*', bp.urlencoded({ extended: false}))

app.set('views', __dirname + '/public')
app.set('view engine','ejs')

//-----------------------

app.get('/', (req, res) => {
    res.render('index.ejs')
})

io.on('connect', (socket) => {
    let room = JSON.parse(fs.readFileSync('F:/문서/node.js/경매/json/room.json').toString())
    
    socket.on('joinRoom', async (name) => {
        for(_room in room.main) {
            console.log(room.main[_room])
            if(room.main[_room] == name) {
                let cookie = undefined
                await app.get('*', (req, res) => {
                    res.cookie('room', _room, { httpOnly: true })
                    cookie = req.cookie.room
                })
                console.log(cookie)
                socket.join(_room)
                return socket.emit('joined')
            }
        }
        socket.emit('noneRoom')
    })

    socket.on('leaveRoom', (name) => {
        socket.leave(name)
    })

    io.on('disconnect', (socket) => {
        socket.emit()
    })
})