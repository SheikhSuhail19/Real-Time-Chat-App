// Node server which will handle socket.io connections

const io = require('socket.io')(8000)

const users = {};

io.on('connection', socket => {
    // If any new user joins, let other users connected to the server know.
    socket.on('new-user-joined', username => {
        users[socket.id] = username;
        socket.broadcast.emit('user-joined', username);
    });

    // If someone sends a message, broadcast it to other people.
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, username: users[socket.id]})
    });

    // If someone leaves the chat, let others know.
    // This is an inbuilt event of socket.io, while new-user-joined, user-joind,  send & receive are built by me.
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

})