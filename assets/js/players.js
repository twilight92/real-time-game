import {
  disableCanvas,
  hideControls,
  enableCanvas,
  showControls,
  resetCanvas
} from "./paint";
import { disableChat } from "./chat";

const board = document.getElementById('jsPBoard');
const notifs = document.getElementById('jsNotifs');

const addPlayers = players => {
    board.innerHTML = '';
    players.forEach(player => {
        const playerElement = document.createElement('span');
        playerElement.innerText = `${player.nickname}: ${player.points}`;
        board.appendChild(playerElement);
    });
};

const setNotifs = (text) => {
    notifs.innerText = '';
    notifs.innerText = text;
};

export const handlePlayerUpdate = ({ sockets }) => addPlayers(sockets);
export const handleGameStarted = () => {
    //disable canvas events
    //hide the canvas controls
    setNotifs('');
    disableCanvas();
    hideControls();
};

export const handleLeaderNotif = ({ word }) => {
    enableCanvas();
    showControls();
    disableChat();
    notifs.innerHTML = `당신이 리더입니다. <br/>제시어는 ${word}입니다.`
};

export const handleGameEnded = () => {
    setNotifs('게임이 종료되었습니다.');
    disableCanvas();
    hideControls();
    resetCanvas();
};

export const handleGameStarting = () => setNotifs('게임이 곧 시작됩니다!');