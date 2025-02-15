const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",  // Allow all origins
        methods: ["GET", "POST"]
    }
});
const ngrok = require('@ngrok/ngrok');

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
const PORT = 6969;
http.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// ngrok integration
ngrok.connect({
    addr: PORT,
    authtoken: '2t4O9FHI0o8BspbxmHA3MbGZkNn_3UKKckZPzmHqsk1oQWQsn'  // Use your ngrok auth token
}).then(url => {
    console.log(`ngrok tunnel is running at: ${url}`);
}).catch(err => {
    console.error("Error while connecting to ngrok:", err);
});
