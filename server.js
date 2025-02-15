const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

//
app.use(express.static('public'));

//
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/viewer.html');
});
app.get('/broadcast', (req, res) => {
    res.sendFile(__dirname + '/public/broadcaster.html');
});

//
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('selfie', (data) => {
        //
        socket.broadcast.emit('selfie', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

//
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
