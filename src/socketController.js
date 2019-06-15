import events from "./events";

let sockets = [];

const socketController = (socket, io) => {
    const broadcast = (event, data) => socket.broadcast.emit(event, data);
    /*
    기존의 socket.broadcast는 자기자신한테는 보내지 않지만
    superBroadcast는 모두에게 예외없이 다 보낼 것.
    */
    const superBroadcast = (event, data) => io.emit(event, data);
    const sandPlayerUpdate = () => superBroadcast(events.playerUpdate, { sockets });

    socket.on(events.setNickname, ({ nickname }) => {
        socket.nickname = nickname;
        sockets.push({id: socket.id, point: 0, nickname: nickname});
        broadcast(events.newUser, { nickname });
        sandPlayerUpdate();
    });

    socket.on(events.disconnect, () => {
        sockets = sockets.filter(aSocket => aSocket.id !== socket.id);
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
