import { initSockets } from './sockets';

const body = document.querySelector('body');
const loginForm = document.getElementById('jsLogin');

const NICKNAME = 'nickname';
const LOGGED_OUT = 'loggedOut';
const LOGGED_IN = 'loggedIn';
const nickname = localStorage.getItem(NICKNAME);

const logIn = nickname => {
    // const socket = io("/");
    // eslint-disable-next-line no-undef
    const socket = io("/");
    socket.emit(window.events.setNickname, { nickname });
    //로그인 전까지는 socket을 시작(initialize)하지 않음
    initSockets(socket);
};

if (nickname === null) {
    body.className = LOGGED_OUT;
} else {
    body.className = LOGGED_IN;
    logIn(nickname);
}

const handleLoginSubmit = e => {
    e.preventDefault();
    const input = loginForm.querySelector('input');
    //input.value
    const { value } = input;
    input.value = '';
    localStorage.setItem(NICKNAME, value);
    body.className = LOGGED_IN;
    logIn(value);
}


if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit)
}