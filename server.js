const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

// Static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/viewer.html');
});
app.get('/broadcast', (req, res) => {
    res.sendFile(__dirname + '/public/broadcaster.html');
});

// Socket.io signaling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('offer', (data) => {
        console.log('Offer received:', data);
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
        console.log('Answer received:', data);
        socket.broadcast.emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
        console.log('ICE Candidate received:', data);
        socket.broadcast.emit('ice-candidate', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
