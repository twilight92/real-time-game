import events from "./events";
import { chooseWord } from "../assets/js/word";

let sockets = [];
let inProgress = false;
let word = null;
let leader = null;

const chooseLeader = () => sockets[Math.floor(Math.random() * sockets.length)];

const socketController = (socket, io) => {
    const broadcast = (event, data) => socket.broadcast.emit(event, data);
    /*
    기존의 socket.broadcast는 자기자신한테는 보내지 않지만
    superBroadcast는 모두에게 예외없이 다 보낼 것.
    */
    const superBroadcast = (event, data) => io.emit(event, data);
    const sandPlayerUpdate = () => superBroadcast(events.playerUpdate, { sockets });
    const startGame = () => {
        if(inProgress === false){
            inProgress = true;
            leader = chooseLeader();
            word = chooseWord();
            //갑작스럽게 진행되지 않도록 setTimeout 걸어줌
            setTimeout(() => {
                superBroadcast(events.gameStarted);
                io.to(leader.id).emit(events.leaderNotif, { word });
            }, 2000);
        }
    };
    const endGame = () => {
        inProgress = false;
        superBroadcast(events.gameEnded);
    };

    socket.on(events.setNickname, ({ nickname }) => {
        socket.nickname = nickname;
        sockets.push({id: socket.id, points: 0, nickname: nickname});
        broadcast(events.newUser, { nickname });
        sandPlayerUpdate();
        if(sockets.length === 2){
            startGame();
        }
    });

    socket.on(events.disconnect, () => {
        sockets = sockets.filter(aSocket => aSocket.id !== socket.id);
        if(sockets.length === 1){
            endGame();
        } else if (leader) {
            if(socket.id === leader.id){
                endGame();
            }
        }
        broadcast(events.disconnected, { nickname: socket.nickname });
        sandPlayerUpdate();
    });

    socket.on(events.sendMsg, ({ message }) =>
        broadcast(events.newMsg, { message, nickname: socket.nickname })
    );

    socket.on(events.beginPath, ({ x, y }) =>
        broadcast(events.beganPath, { x, y })
    );

    socket.on(events.strokePath, ({ x, y, color }) => {
        broadcast(events.strokedPath, { x, y, color });
    });

    socket.on(events.fill, ({ color }) => {
        broadcast(events.filled, { color });
    });
};

export default socketController;