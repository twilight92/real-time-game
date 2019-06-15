import {join} from 'path';
import express from 'express';
import socketIO from 'socket.io';
import logger from 'morgan';
import socketController from './socketController';
import events from "./events";

const PORT = 4000;
const app = express();
app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'))
app.use(logger('dev'))
app.use(express.static(join(__dirname, 'static')))

/* 
프론트에서는 events.js를 그냥 import할 수 없다. 서버쪽에서 보내주어야한다.
pug 템플릿이 events라는 새로운 변수를 가지게 됨
home 화면을 그리면서 events 파일도 전달

home.pug :
--------------------------------------
script.
            window.events = !{events};
--------------------------------------

login.js :
--------------------------------------
socket.emit(window.captureEvents.setNickname , { nickname });
--------------------------------------

서버와 클라이언트에서 한 파일을 같이 사용할 수 있도록
*/
app.get("/", (req, res) => res.render("home", { events : JSON.stringify(events)}));

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
// io는 서버 자체 : 이걸 이용해서 무언가 할 수 있다.
const io = socketIO.listen(server);
// const io = socketIO(server);

/* 
서버파일이 너무 커지지 않게 하면서
동시에 socket도 활용할 수 있도록 내용 socketController.js로 이동
 */

// socket은 연결되어있는 각 socket들을 뜻한다.
/* 
socket은 하나의 socket한테만 메시지를 보내거나
자기 자신을 제외한 모두한테 보내는것 외에는 옵션이 없다.
io.on("connection", socket => socketController(socket));

이 경우에 우리한테 필요한 건 모든 connected 상태의 client들에게만 메시지를 보내는 것(나를 포함)
그래서 이제는 socket만 쓰는게 아니라 io도 사용해야하므로 추가.
*/
io.on("connection", socket => socketController(socket, io));
