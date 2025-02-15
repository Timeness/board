const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Static files serve karne ke liye
app.use(express.static('public'));

// Default route for viewer.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/viewer.html');
});

// Route for broadcaster.html
app.get('/broadcast', (req, res) => {
    res.sendFile(__dirname + '/public/broadcaster.html');
});

// Socket.io logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.broadcast.emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
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
