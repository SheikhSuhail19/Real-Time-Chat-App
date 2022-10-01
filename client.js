const socket = io('http://localhost:8000');

// Get DOM elements in respective JS variables.
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector(".container");

// Audio that will play on receiving messages.
var audio = new Audio(ting.mp3);

// Function which will append event to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left') {
        audio.play();
    }
}


// Ask new user for his/her name & let the server know
const username = prompt("Enter your name to join the chat room");
socket.emit('new-user-joined', username);

// If the new user joins, receive his/her name from the server
socket.on('user-joined', data => {
    append(`${username} joined the chat`, 'left')
})

// If server sends a message, receive it
socket.on('receive', data => {
    append(`${data.username}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('leave', username => {
    append(`${username} left the chat`, 'left');
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = "";
})