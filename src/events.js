//이벤트 이름들은 어딘가에 표준화 해주는 것이 좋다. 그래서 events.js 파일 생성
const events = {
    setNickname: 'setNickname',
    newUser: 'newUser',
    disconnect : 'disconnect',
    disconnected : 'disconnected',
    sendMsg : 'sendMsg',
    newMsg : 'newMsg'
}

export default events;