import {join} from 'path';
import express from 'express';
import socketIO from 'socket.io';
import logger from 'morgan';

const PORT = 4000;
const app = express();
app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'))
app.use(logger('dev'))
app.use(express.static(join(__dirname, 'static')))
app.get('/', (req, res) => res.render('home'));

const handleListening = () => console.log(`Server running: http://localhost:${PORT}`)

//server라는 변수를 만들어서 SocketIO에 전달하기 위함
const server = app.listen(PORT, handleListening);

/* 
io라는 변수를 만든 이유 : io가 모든 이벤트를 알아야하기 때문
HTTP는 GET/ POST/ PUT/ PATCH/ DELETE 라우터를 가지고 있다.
하지만 Socket은 페이지가 없고 연결만이 있다.
이벤트를 가지고 있다.
서버는 이벤트를 보낼 수 있고,
클라이언트, 유저 또한 이벤트를 보낼 수 있다.
둘 다 이벤트를 받을 수 있다.

이벤트에서 가장 중요한 것은 'connection'
*/
//const io = socketIO.listen(server)
const io = socketIO(server);

/* 
public : 자신을 포함한 모든 클라이언트에 데이터 전달
broadcast : 자신을 제외한 모든 클라이언트에 데이터 전달
private : 특정 클라이언트에 데이터 전달
 */
io.on('connection', socket => {
    socket.on('newMsg', ({ msg }) => {
        socket.broadcast.emit('messageNotification', {
            msg,
            nickname: socket.nickname || '익명'
        });
    });
    socket.on('setNickname', ({ nickname }) => {
        socket.nickname = nickname;
    });
});

