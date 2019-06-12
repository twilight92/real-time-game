const socket = io('/');

var sendMsg = function(msg) {
    socket.emit("newMsg", { msg });
    console.log(`나 : ${msg}`)
};

var handleMessageNotif = function(data) {
    const { msg, nickname } = data;
    console.log(`${nickname} : ${msg}`);
};

var setNickname = function(nickname){
    socket.emit('setNickname', { nickname });
}


socket.on("messageNotification", handleMessageNotif);