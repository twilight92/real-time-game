import events from './events';

const socketController = socket => {
    //broadcast쓸 일이 많아서 함수로 만들어 버림
    const broadcast = (event, data) => socket.broadcast.emit(event, data);

    socket.on(events.setNickname, ({ nickname }) => {
        socket.nickname = nickname;
        broadcast(events.newUser, { nickname });
    });
    socket.on(events.disconnect, () => {
        broadcast(events.disconnected, { nickname : socket.nickname })
    });
    socket.on(events.sendMsg, ({message}) => {
        broadcast(events.newMsg, { message, nickname : socket.nickname })
    });
};

export default socketController;