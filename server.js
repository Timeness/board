const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",  // Allow all origins
        methods: ["GET", "POST"]
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

// Socket.io
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('selfie', (data) => {
        console.log("Received image from broadcaster:", socket.id);
        socket.broadcast.emit('selfie', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start server on port 6969
const PORT = 8380;
http.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
